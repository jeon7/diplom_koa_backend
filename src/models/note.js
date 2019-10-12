import mongoose, { Schema } from 'mongoose';

const NoteSchema = new Schema({
  title: String,
  standardPortion: Number,
  ingredients: String,
  memo: String,
  tags: [String],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  }
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;