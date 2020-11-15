const { Schema, model } = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: "Please provide a unique username!",
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: "Please provide a unique email address!",
      unique: true,
      match: [/.+@.+\..+/, 'Must match a valid email address!'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false,
  }
);

UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
