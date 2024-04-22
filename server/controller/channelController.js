import asyncHandler from 'express-async-handler';
import Channel from '../model/channelModel.js';
import sendMessageDB from '../message_to_db/sendMessageDB.js';
import getMessagesDB from '../message_to_db/getMessagesDB.js';
import Subscription from '../model/subscriptionModel.js';
import Message from '../model/messageModel.js';
import User from '../model/userModel.js';

// Channel create controller
export const createChannel = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const findChannel = await Channel.findOne({ name });
  if (findChannel) {
    return res.status(400).json({ message: 'Channel already exists' });
  }

  const channel = await Channel.create({ ...req.body });
  res.status(201).json({ message: 'Channel created successfully', channel });
});

// Get all channels controller
export const getAllChannels = asyncHandler(async (req, res) => {
  // find all channels and reverse the array to get the latest channel first
  const channel = await Channel.find({}).sort({ createdAt: -1 });
  res.status(200).json(channel);
});

// Get channel by id controller
export const getChannelById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const channel = await Channel.findById(id);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  res.status(200).json({ channel });
});

// Get channel by slug controller
export const getChatBySlugAPI = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const limit = parseInt(req.params.limit);

  const messages = await getMessagesDB(slug, limit);

  if (!messages || messages.length === 0) {
    res.status(404);
    throw new Error('Channel not found or no messages found');
  }

  res.status(200).json({ messages });
});

// Send message in channel controller
export const sendMessageAPI = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const { admin, msg } = req.body;

  const newMessage = await sendMessageDB(slug, admin, msg);

  res.status(200).json({ message: 'Message sent successfully', newMessage });
});

// Delete channel by id controller
export const deleteChannelById = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.id;

    // Find and delete the channel by ID
    const channel = await Channel.findByIdAndDelete(channelId);

    // Check if the channel was not found
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const deletedSubscriptions = await Subscription.find({
      channel: channelId,
    });
    const subscriptionIds = deletedSubscriptions.map((sub) => sub._id);

    await User.updateMany(
      { subscription: { $in: subscriptionIds } },
      { $pull: { subscription: { $in: subscriptionIds } } }
    );

    // Delete all subscriptions associated with the channel
    await Subscription.deleteMany({ channel: channelId });

    // Delete all messages associated with the channel
    await Message.deleteMany({ channel: channelId });

    // Respond with success message
    res.status(200).json({ message: 'Channel deleted successfully', channel });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

// Update channel by id controller
export const updateChannelById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  const channel = await Channel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  if (name) {
    channel.slug = channel.makeSlug();
    await channel.save();
  }

  res.status(200).json({ message: 'Channel updated successfully', channel });
});
