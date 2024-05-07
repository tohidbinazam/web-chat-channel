import expressAsyncHandler from 'express-async-handler';
import getMessagesDB from '../../message_to_db/getMessagesDB.js';
import Subscription from '../../models/Subscription.js';

export const getAllSubscriptions = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find subscriptions for the specified user id and populate the 'channel' field
    const subscriptions = await Subscription.find({ user: id }).populate(
      'channel',
      'name slug status'
    );

    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getSingleSubscription = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the subscription by id and populate the 'channel' field
    const subscription = await Subscription.findById(id).populate(
      'channel',
      'name slug status'
    );

    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
