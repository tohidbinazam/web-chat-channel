import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const userFilter = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;

  if (!email && !mobile) {
    res.status(400);
    throw new Error('Please provide email or mobile number');
  }

  let user;
  let foundBy;

  if (email) {
    user = await User.findOne({ email })
      .select('-password -token')
      .populate('subscription');
    if (user) {
      foundBy = 'email';
    }
  }

  if (!user && mobile) {
    user = await User.findOne({ mobile })
      .select('-password -token')
      .populate('subscription');
    if (user) {
      foundBy = 'mobile';
    }
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let message;
  if (foundBy === 'email') {
    message = 'User found via email';
  } else if (foundBy === 'mobile') {
    message = 'User found via mobile';
  }

  res.status(200).json({ user, message });
});
