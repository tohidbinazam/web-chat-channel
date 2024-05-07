import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const User = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscription: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
      },
    ],
    token: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// make password hash before save and update
User.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

// compare password
User.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

User.methods.removePass = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default model('User', User);
