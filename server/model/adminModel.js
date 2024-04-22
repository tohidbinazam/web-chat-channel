import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { log } from 'console';

const adminModel = Schema(
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
      type: String,
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
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
adminModel.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

// compare password
adminModel.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

adminModel.methods.removePass = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

// make getResetPasswordToken
adminModel.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

export default model('Admin', adminModel);
