import Message from '../models/Message.js';
import Subscription from '../models/Subscription.js';
import Channel from '../models/Channel.js';

const sendMessageDB = async (channelSlug, adminId, text) => {
  try {
    // Find the channel ID using the slug
    const channel = await Channel.findOne({ slug: channelSlug });

    if (!channel) {
      throw new Error('Channel not found');
    }

    const activeSubscribers = await Subscription.find({
      channel: channel._id,
      status: true,
      endDate: { $gt: Date.now() },
    }).select('user');

    // if (activeSubscribers.length === 0) {
    //   throw new Error('No active subscribers found for this channel.');
    // }

    // Extract the user IDs of active subscribers
    const receivers = activeSubscribers.map((subscriber) => subscriber.user);

    // Create the message with receivers as an array
    const message = await Message.create({
      channel: channel._id,
      admin: adminId,
      text,
      receivers,
    });

    // Populate the admin field with the first_nm and last_nm
    // and select only the text and admin field
    const newMessage = await Message.findById(message._id)
      .populate('admin', 'first_nm')
      .populate('channel', 'slug name')
      .select('text admin createdAt receivers channel')
      .exec();
    return newMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendMessageDBV1 = async (slug, admin, msg) => {
  const channel = await channelModel
    .findOneAndUpdate(
      { slug },
      {
        $push: {
          chat: {
            $each: [{ admin, msg }],
            $position: 0,
          },
        },
      },
      { new: true }
    )
    .populate('chat.admin', 'first_nm last_nm');

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  const response = channel.chat[0];

  const newMessage = {
    admin: {
      _id: response.admin._id,
      name: `${response.admin.first_nm} ${response.admin.last_nm}`,
    },
    msg: response.msg,
    _id: response._id,
    time: response.time,
  };

  return newMessage;
};

export default sendMessageDB;
