import Router from 'koa-router';
import * as notesCtrl from './notes.ctrl';
import checkedLoggedIn from '../../lib/checkLoggedIn';

const notes = new Router();

notes.get('/', notesCtrl.list); // list 
notes.post('/', checkedLoggedIn, notesCtrl.write); // C
notes.get('/:id', notesCtrl.getNoteById, notesCtrl.read); // R
notes.patch('/:id', notesCtrl.getNoteById, checkedLoggedIn, notesCtrl.checkOwnNote, notesCtrl.update); // U 
notes.delete('/:id', notesCtrl.getNoteById, checkedLoggedIn, notesCtrl.checkOwnNote, notesCtrl.remove); // D

export default notes;