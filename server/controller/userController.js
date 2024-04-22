import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import sendEmail from '../utility/sendEmail.js';
import bcrypt from 'bcryptjs';
import Message from '../model/messageModel.js';
import Subscription from '../model/subscriptionModel.js';

// User create controller
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, subscription } = req.body;
  console.log(subscription);

  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = await User.create({ name, email, password });

  // Create each subscription in subscription collection asynchronously
  const createdSubscriptions = await Promise.all(
    subscription.map(async (sub) => {
      const newSubscription = await Subscription.create({
        user: newUser._id,
        plan: sub.plan,
        channel: sub.channel,
        endDate: sub.endDate,
        status: sub.status,
      });
      return newSubscription._id; // Return the ObjectId of the newly created subscription
    })
  );

  // Update the user's subscription field with the newly created subscription ObjectIds
  const user = await User.findByIdAndUpdate(
    newUser._id,
    {
      $push: { subscription: { $each: createdSubscriptions } },
    },
    { new: true }
  )
    .select('-password -token')
    .populate('subscription');

  // Send email after updating all channels
  sendEmail(
    email,
    'Account created successfully',
    `
    Email: ${email},
    Password: ${req.body.password}
    `
  );

  res.status(201).json({ message: 'User created successfully', user });
});

// Get all users controller
export const getAllUsers = asyncHandler(async (req, res) => {
  // sort by last created
  const users = await User.find()
    .select('-password -token')
    .sort({ createdAt: -1 })
    .populate('subscription');
  res.status(200).json({ users });
});

// Get user by id controller
export const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ user });
});

// Delete user by id controller
export const deleteUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Find and delete the user
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete all subscriptions for this user
  await Subscription.deleteMany({ user: id });

  // Update messages to remove the deleted user from receivers array
  await Message.updateMany({ receivers: id }, { $pull: { receivers: id } });

  res.status(200).json({ message: 'User deleted successfully', user });
});

// Update user by id controller
export const updateUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email, password, subscription, status } = req.body;

  if (status !== undefined) {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true })
      .select('-password -token')
      .populate('subscription');

    return res.status(200).json({ message: 'User updated successfully', user });
  }

  // If req.body contains password, then hash it
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, password },
    { new: true }
  ).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Array to store IDs of new subscriptions
  const newSubscriptionIds = [];

  // Update or create subscriptions for existing and new channels
  await Promise.all(
    subscription.map(async (sub) => {
      if (sub._id) {
        // Update existing subscription
        await Subscription.findByIdAndUpdate(sub._id, sub, { new: true });
      } else {
        // Create new subscription
        const createdSub = await Subscription.create({ user: id, ...sub });
        // Push the ID of the new subscription into the array
        newSubscriptionIds.push(createdSub._id);
      }
    })
  );

  // Push only the IDs of new subscriptions into the user's subscription array
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $push: { subscription: { $each: newSubscriptionIds } } },
    { new: true }
  )
    .select('-password')
    .populate('subscription');

  // Respond with updated user data
  res
    .status(200)
    .json({ message: 'User updated successfully', user: updatedUser });
});
