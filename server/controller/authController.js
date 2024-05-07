import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
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
  const { email, password, next } = req.body;

  // Find the admin by email and populate the role
  const admin = await Admin.findOne({ email }).populate('role', 'status');

  // Check if admin exists and if the password matches
  if (!admin || !admin.matchPassword(password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check if the admin's status is active
  if (!admin.status) {
    return res.status(400).json({ message: 'Please contact the admin' });
  }

  // Check if the admin's role is active
  if (!admin.role || !admin.role.status) {
    return res.status(400).json({ message: 'Your role is inactive' });
  }

  // Check if the admin is already logged in another device
  if (!next && admin.token) {
    return res
      .status(406)
      .json({ message: 'You are already logged in another device' });
  }

  // Populate role permissions and generate token
  await admin.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'name slug status',
    },
  });

  const token = generateToken(admin._id, '365d');

  // Save the token to the admin and send it in a cookie
  admin.token = token;
  await admin.save();

  // No need to select fields here, as they were already excluded in the findOne() query

  res
    .cookie('token', token, {
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000, // 1 year
      secure: process.env.NODE_ENV === 'PRODUCTION', // Using uppercase "PRODUCTION"
      // httpOnly: true,  Ensures the cookie is only accessible via HTTP(S)
    })
    .status(200)
    .json({ message: 'Login successful', admin: admin.removePass() });
});

// Admin logout controller
export const logout = asyncHandler(async (req, res) => {
  const { id } = req.data;
  await Admin.findByIdAndUpdate(id, { token: null });
  res.clearCookie('token').status(200).json({ message: 'Logout successful' });
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

  const message = `Hi ${admin.first_nm}, your password has been changed successfully.`;
  await sendEmail(admin.email, 'Password changed', message);
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

  const message = `Your password has been reset successfully. If you did not initiate this request, please contact the admin immediately.`;
  await sendEmail(admin.email, 'Password reset successful', message);
});
