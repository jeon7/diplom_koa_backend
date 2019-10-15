import mongoose from 'mongoose';
import User from '../../models/user';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

/*
  GET /api/plan
*/
export const list = async ctx => {
  const { user } = ctx.state;
  try {
    // populate
    const result = await User.findOne({ _id: user._id }).populate('plan.noteId');
    ctx.body = result.plan;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/plan/add
  {
    "noteId": "noteId",
    "cookingPortion": 3
    "index": "w1,d1,m1"
  }
*/
export const add = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    noteId: Joi.string().required(),
    cookingPortion: Joi.number().required(),
    index: Joi.string().required(),

  });

  // 검증 후, 검증 실패시 에러처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const { user } = ctx.state;
    const { noteId, cookingPortion, index } = ctx.request.body;
    const meal = {
      noteId: noteId,
      cookingPortion: cookingPortion,
      index: index
    }
    User.findOneAndUpdate({ '_id': user._id },
      { $push: { plan: meal } }, function (err, data) {
        console.log(data);
        if (err) {
          ctx.status = 500;
          return;
        }
        if (!data) {
          ctx.status = 500;
          return;
        }
        return;
      });
    ctx.body = await User.findById(user._id);

  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/plan/remove/:id(mealObjId)
*/
export const remove = async ctx => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }

  try {
    const { user } = ctx.state;
    const userModel = await User.findById(user._id);
    userModel.plan.pull(id);
    userModel.save();
    ctx.body = userModel;
  } catch (e) {
    ctx.throw(500, e);
  }
};