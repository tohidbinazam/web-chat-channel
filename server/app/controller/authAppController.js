import asyncHandler from 'express-async-handler';
import User from '../../models/User.js';
import { generateToken, verifyToken } from '../../utility/manageToken.js';
import sendEmail from '../../utility/sendEmail.js';
import crypto from 'crypto';

// User login controller
export const login = asyncHandler(async (req, res) => {
  const { email, password, next } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.matchPassword(password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check status key value
  if (!user.status) {
    return res.status(400).json({
      message: 'Account is currently disabled. Please contact support.',
    });
  }

  if (user.token && !next) {
    return res.status(406).json({
      message: 'Account is currently logged in another device.',
    });
  }

  // Update token
  const newToken = generateToken(user._id);
  user.token = newToken;
  await user.save();

  // Remove password from user object
  user.removePass();

  res.status(200).json({ message: 'Login successfully', user });
});

// User logout controller
export const logout = asyncHandler(async (req, res) => {
  const init_user = req.user;

  init_user.token = null;
  await init_user.save();

  res.status(200).json({ message: 'Logout successfully' });
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({ user });
});

export const checkPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);

  if (!user.matchPassword(password)) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  res.status(200).json({ next: true });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);

  if (user.matchPassword(password)) {
    return res
      .status(400)
      .json({ message: "New password can't be the same as the old password" });
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, {
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

  res.status(200).json({ user, message: 'Profile updated successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const token = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${token}`;

  res.status(200).json({ message: 'Reset password link sent to your email' });

  // send email
  const message = `Your password reset link is as follows: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it. expire in 10 min`;

  try {
    await sendEmail(user.email, 'Password reset token', message);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

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

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const data = await user.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'name slug status',
    },
  });

  const JWTToken = generateToken(user._id, '365d');
  const final_user = data.removePass();

  res
    .cookie('token', JWTToken, {
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
    })
    .status(200)
    .json({
      message: 'Login successfully after reset password',
      user: final_user,
    });
});
