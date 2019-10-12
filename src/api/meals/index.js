import Router from 'koa-router';
import checkedLoggedIn from '../../lib/checkLoggedIn';
import * as mealsCtrl from './meals.ctrl';

const meals = new Router();

// meals.get('/', mealsCtrl.list); // list 
meals.patch('/add/:id', checkedLoggedIn, mealsCtrl.add);
meals.patch('/remove/:id', checkedLoggedIn, mealsCtrl.remove);

export default meals;