import mongoose from 'mongoose';
import User from '../../models/user';

const { ObjectId } = mongoose.Types;

/*
  PATCH /api/meals/add/:id
*/
export const add = async ctx => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }

  try {
    const { user } = ctx.state;
    const userModel = await User.findById(user._id);
    // userModel.addMealPlan(id, 3);
    ctx.body = userModel;
  } catch (e) {
    ctx.throw(500, e);
  }
};


/*
  PATCH /api/meals/remove/:id
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
    // userModel.removeBookmark(id);
    ctx.body = userModel;
  } catch (e) {
    ctx.throw(500, e);
  }
};