import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const Admin = Schema(
  {
    first_nm: {
      type: String,
      required: true,
      trim: true,
    },
    last_nm: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    birth: {
      type: Date,
      max: Date.now() - 15 * 365 * 24 * 60 * 60 * 1000,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// make password hash before save
Admin.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

// compare password
Admin.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Admin.methods.removePass = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

// make getResetPasswordToken
Admin.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

export default model('Admin', Admin);
