import mongoose from 'mongoose';
import User from '../../models/user';

const { ObjectId } = mongoose.Types;

/*
  GET /api/bookmarks
*/
export const list = async ctx => {
  const { user } = ctx.state;
  try {
    // populate
    const result = await User.findOne({ _id: user._id }).populate('bookmarkedNoteIds');
    ctx.body = result.bookmarkedNoteIds;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/bookmarks/add/:id
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
    await userModel.addBookmark(id);
    ctx.body = userModel;

  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/bookmarks/remove/:id
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
    await userModel.removeBookmark(id);
    ctx.body = userModel;

  } catch (e) {
    ctx.throw(500, e);
  }
};