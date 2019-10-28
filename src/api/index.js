import Router from 'koa-router';
import notes from './notes/index';
import auth from './auth/index';
// import bookmarks from './bookmarks/index';
// import plan from './plan/index';
// import shopping from './shopping/index';

const api = new Router();

api.use('/notes', notes.routes()); // including bookmarkCtrl api
api.use('/auth', auth.routes());
// api.use('/bookmarks', bookmarks.routes());
// api.use('/plan', plan.routes());
// api.use('/shopping', shopping.routes());

export default api;