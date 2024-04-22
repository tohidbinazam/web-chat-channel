import Message from '../model/messageModel.js';
import Channel from '../model/channelModel.js';
import asyncHandler from 'express-async-handler';
import getMessagesDB from '../message_to_db/getMessagesDB.js';
import sendMessageDB from '../message_to_db/sendMessageDB.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { adminId, channelSlug, text } = req.body;

  try {
    const message = await sendMessageDB(channelSlug, adminId, text);

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const getMessage = asyncHandler(async (req, res) => {
  const { slug, limit, userID } = req.body;

  const messages = await getMessagesDB(slug, limit, userID);
  res.status(200).json({ messages });
});

// DEEP Drive
export const sendMessageDeep = asyncHandler(async (req, res) => {
  const { senderId, channelId, text } = req.body;

  // Find the channel and populate its subscribers with subscription details
  const channel = await Channel.findById(channelId).populate(
    'subscribers',
    'subscription'
  );

  // Get all active subscribers for the specified channelId
  const activeSubscribers = channel.subscribers.filter((subscriber) =>
    subscriber.subscription.some(
      (sub) =>
        sub.channel.toString() === channelId &&
        new Date(sub.endDate) > Date.now()
    )
  );

  if (activeSubscribers.length === 0) {
    return res
      .status(404)
      .json({ error: 'No active subscribers found for this channel.' });
  }

  // The receivers will be the IDs of the active subscribers
  const receivers = activeSubscribers.map((subscriber) => subscriber._id);

  // Create the message with receivers as an array
  const message = await Message.create({
    channel: channelId,
    admin: senderId,
    text,
    receiver: receivers,
  });

  res.status(200).json({ message });
});
