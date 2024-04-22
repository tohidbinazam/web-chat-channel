import asyncHandler from 'express-async-handler';
import Admin from '../model/adminModel.js';
import { generateToken } from '../utility/manageToken.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utility/sendEmail.js';
import crypto from 'crypto';

// Admin registration controller
export const register = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const check = await Admin.findOne({ email });
  if (check) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const data = await Admin.create(req.body);
  const admin = data.removePass();
  res.status(201).json({ message: 'Admin Registration Done', admin });
});

// Admin login controller
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check status key value
  const init_admin = await Admin.findOne({ email });

  if (!init_admin || !init_admin.matchPassword(password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  if (!init_admin.status) {
    return res.status(400).json({ message: 'Please contact with admin' });
  }

  const data = await init_admin.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'name slug status',
    },
  });

  const token = generateToken(data._id, '365d');
  const admin = data.removePass();

  res
    .cookie('token', token, {
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
    })
    .status(200)
    .json({ message: 'Login successfully', admin });
});

// Admin logout controller
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout successfully' });
});

export const me = asyncHandler(async (req, res) => {
  const { id } = req.data;

  // populate role and permission field with name and slug
  const admin = await Admin.findById(id)
    .populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'name slug status',
      },
    })
    .select('-password');

  res.status(200).json(admin);
});

export const checkPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const admin = await Admin.findById(id);

  if (!admin.matchPassword(password)) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  res.status(200).json({ new_Pass: true });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const admin = await Admin.findById(id);

  if (admin.matchPassword(password)) {
    return res
      .status(400)
      .json({ message: "New password can't be the same as the old password" });
  }

  admin.password = password;
  await admin.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .select('-password')
    .populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'name slug status',
      },
    });

  res.status(200).json({ admin, message: 'Profile updated successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({
    email,
  });

  if (!admin) {
    return res.status(400).json({ message: 'Admin not found' });
  }

  const token = admin.getResetPasswordToken();
  await admin.save();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${token}`;

  res.status(200).json({ message: 'Reset password link sent to your email' });

  // send email
  const message = `Your password reset link is as follows: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it. expire in 10 min`;

  try {
    await sendEmail(admin.email, 'Password reset token', message);
  } catch (error) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const admin = await Admin.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!admin) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;

  await admin.save();

  const data = await admin.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'name slug status',
    },
  });

  const JWTToken = generateToken(admin._id, '365d');
  const final_admin = data.removePass();

  res
    .cookie('token', JWTToken, {
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
    })
    .status(200)
    .json({
      message: 'Login successfully after reset password',
      admin: final_admin,
    });
});
