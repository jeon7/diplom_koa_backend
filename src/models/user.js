import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
  bookmarkedNotes: [{
    type: mongoose.Types.ObjectId,
    ref: 'Note'
  }],
  mealPlanNotes: [{
    type: mongoose.Types.ObjectId,
    ref: 'Note',
    portion: Number,
    planed: String
  }],
});

// model instance method setPassword
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10); // salt rounds = 10
  this.hashedPassword = hash;
}

// model instance method checkPassword
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // boolean
}

// model instance method serialize
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
}

// model static method findByUserName
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
}

// model instance method generateToken
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // parameter1: data to put in the token
    {
      _id: this.id,
      username: this.username
    },
    process.env.JWT_SECRET, // parameter2: JWT password
    {
      expiresIn: '7d'
    }
  );
  return token;
}

const User = mongoose.model('User', UserSchema);
export default User;