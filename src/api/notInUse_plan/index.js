import Router from 'koa-router';
import checkedLoggedIn from '../../lib/checkLoggedIn';
import * as planCtrl from './plan.ctrl';

const plan = new Router();

plan.get('/', checkedLoggedIn, planCtrl.list); // list 
plan.patch('/add', checkedLoggedIn, planCtrl.add);
plan.patch('/remove/:id', checkedLoggedIn, planCtrl.remove);

export default plan;