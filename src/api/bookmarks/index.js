import Router from 'koa-router';
import checkedLoggedIn from '../../lib/checkLoggedIn';
import * as bookmarksCtrl from './bookmarks.ctrl';

const bookmarks = new Router();

bookmarks.get('/', bookmarksCtrl.list); // list 
bookmarks.patch('/add/:id', checkedLoggedIn, bookmarksCtrl.add);
bookmarks.patch('/remove/:id', checkedLoggedIn, bookmarksCtrl.remove);

export default bookmarks;