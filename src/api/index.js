import Router from 'koa-router';
import notes from './notes/index';
import auth from './auth/index';
import bookmarks from './bookmarks/index';
import meals from './meals/index';

const api = new Router();

api.use('/notes', notes.routes());
api.use('/auth', auth.routes());
api.use('/bookmarks', bookmarks.routes());
api.use('/meals', meals.routes());

export default api;
