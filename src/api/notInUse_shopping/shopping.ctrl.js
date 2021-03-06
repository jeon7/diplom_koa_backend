import mongoose from 'mongoose';
import User from '../../models/user';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

/*
  GET /api/shopping
*/
export const list = async ctx => {
  const { user } = ctx.state;
  try {
    // populate
    const result = await User.findOne({ _id: user._id }).populate('shopping.noteId');
    ctx.body = result.shopping;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/shopping/add
  {
    "noteId": "",
    "cookingPortion": 3
  }
*/
export const add = async ctx => {
  const schema = Joi.object().keys({
    noteId: Joi.string().required(),
    cookingPortion: Joi.number().required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const { user } = ctx.state;
    const { noteId, cookingPortion } = ctx.request.body;
    const meal = {
      noteId: noteId,
      cookingPortion: cookingPortion
    }
    User.findOneAndUpdate({ '_id': user._id },
      { $push: { shopping: meal } }, function (err, data) {
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
  PATCH /api/shopping/remove/:id(mealObjId)
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
    userModel.shopping.pull(id);
    userModel.save();
    ctx.body = userModel;
  } catch (e) {
    ctx.throw(500, e);
  }
};