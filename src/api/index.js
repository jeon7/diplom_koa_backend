import Router from 'koa-router';
import notes from './notes/index';
import auth from './auth/index';

const api = new Router();

api.use('/notes', notes.routes());
api.use('/auth', auth.routes());

export default api;
