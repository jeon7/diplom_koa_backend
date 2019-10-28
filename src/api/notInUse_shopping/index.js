import Router from 'koa-router';
import checkedLoggedIn from '../../lib/checkLoggedIn';
import * as shoppingCtrl from './shopping.ctrl';

const shopping = new Router();

shopping.get('/', checkedLoggedIn, shoppingCtrl.list); // list 
shopping.patch('/add', checkedLoggedIn, shoppingCtrl.add);
shopping.patch('/remove/:id', checkedLoggedIn, shoppingCtrl.remove);

export default shopping;