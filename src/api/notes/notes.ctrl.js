import Note from '../../models/note';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import User from '../../models/user';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

export const getNoteById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const note = await Note.findById(id);
    // no note available
    if (!note) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.note = note;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnNote = (ctx, next) => {
  const { user, note } = ctx.state;
  if (note.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

/*
  GET /api/notes?username=&tag=&page=
*/
export const list = async ctx => {
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // check for validity of tag, username, and save
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const notes = await Note.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const noteCount = await Note.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(noteCount / 10));
    ctx.body = notes.map(note => ({
      ...note,
      body: removeHtmlAndShorten(note.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

/*
  POST /api/notes
{
	"title": "chicken noodle soup",
	"standardPortion": 4,
	"ingredients": "meat,chicken,600,g; etc,salt,1,t; vegi,carrot,200,g",
	"memo": "1.5 hr",
	"tags": ["chicken", "noodle", "soup"]
}
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    // check for validity
    title: Joi.string().required(),
    standardPortion: Joi.number().required(),
    ingredients: Joi.string().required(),
    memo: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
  });

  // validity failed
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, standardPortion, ingredients, memo, tags } = ctx.request.body;
  const note = new Note({
    title,
    standardPortion,
    ingredients: sanitizeHtml(ingredients, sanitizeOption),
    memo: sanitizeHtml(memo, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await note.save();
    ctx.body = note;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/notes/:id
*/
export const read = async ctx => {
  ctx.body = ctx.state.note;
};

/*
  PATCH /api/notes/:id
{
	"memo": "3 hr"
}
*/
export const update = async ctx => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    standardPortion: Joi.number(),
    ingredients: Joi.string(),
    memo: Joi.string(),
    tags: Joi.array()
      .items(Joi.string())
  });

  // check for validity 
  const result = Joi.validate(ctx.request.body, schema);
  // validity failed
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body };
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body);
  }

  try {
    const note = await Note.findByIdAndUpdate(id, nextData, {
      new: true,
    }).exec();
    if (!note) {
      ctx.status = 404;
      return;
    }
    ctx.body = note;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  DELETE /api/notes/:id
*/
export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Note.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content 
  } catch (e) {
    ctx.throw(500, e);
  }
};

///////////////////////////////////
// todo


/*
  PATCH /api/notes?bookmark=list/add/remove&id=
*/
export const bookmarkCtrl = async ctx => {

  const { bookmark, id } = ctx.query;
  const { user } = ctx.state;

  // list bookmarks

  try {
    // populate
    const result = await User.findOne({ _id: user._id }).populate('bookmarkedNoteIds');
    ctx.body = result.bookmarkedNoteIds;
  } catch (e) {
    ctx.throw(500, e);
  }


  if (bookmark === 'add') {
    try {
      const { user } = ctx.state;
      const userModel = await User.findById(user._id);
      await userModel.addBookmark(id);
      ctx.body = userModel;

    } catch (e) {
      ctx.throw(500, e);
    }
  }

  if (bookmark === 'remove') {
    try {
      const { user } = ctx.state;
      const userModel = await User.findById(user._id);
      await userModel.removeBookmark(id);
      ctx.body = userModel;

    } catch (e) {
      ctx.throw(500, e);
    }
  }

};