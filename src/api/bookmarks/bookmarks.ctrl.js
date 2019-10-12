import Note from '../../models/note';
import mongoose from 'mongoose';
import User from '../../models/user';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

// /*
//   GET /api/notes?username=&tag=&page=
// */
// export const list = async ctx => {
//   // query 는 문자열이기 때문에 숫자로 변환해주어야합니다.
//   // 값이 주어지지 않았다면 1 을 기본으로 사용합니다.
//   const page = parseInt(ctx.query.page || '1', 10);

//   if (page < 1) {
//     ctx.status = 400;
//     return;
//   }

//   const { tag, username } = ctx.query;
//   // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
//   const query = {
//     ...(username ? { 'user.username': username } : {}),
//     ...(tag ? { tags: tag } : {}),
//   };

//   try {
//     const notes = await Note.find(query)
//       .sort({ _id: -1 })
//       .limit(10)
//       .skip((page - 1) * 10)
//       .lean()
//       .exec();
//     const noteCount = await Note.countDocuments(query).exec();
//     ctx.set('Last-Page', Math.ceil(noteCount / 10));
//     ctx.body = notes.map(note => ({
//       ...note,
//       body: removeHtmlAndShorten(note.body),
//     }));
//   } catch (e) {
//     ctx.throw(500, e);
//   }
// };

// const removeHtmlAndShorten = body => {
//   const filtered = sanitizeHtml(body, {
//     allowedTags: [],
//   });
//   return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
// };


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

    // populate
    User.findOne({ _id: user._id }).populate('bookmarkedNoteId').exec((err, data) => {
      console.log(data);
    })

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

    // populate
    User.findOne({ _id: user._id }).populate('bookmarkedNoteId').exec((err, data) => {
      console.log(data);
    })

  } catch (e) {
    ctx.throw(500, e);
  }
};