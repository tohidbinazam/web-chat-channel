import Channel from '../models/Channel.js';
import Message from '../models/Message.js';

const getMessagesDB = async (slug, limit = 20, userID) => {
  const channel = await Channel.findOne({ slug });

  // Create the query object
  const query = {
    channel: channel._id,
  };

  // If userID is provided, add it to the query
  if (userID) {
    query.receivers = userID;
  }

  // Find messages based on the query
  const messages = await Message.find(query)
    .populate('admin', 'first_nm last_nm')
    .select('text createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Count the messages based on the same query
  const count = await Message.countDocuments(query);

  return {
    messages,
    count,
  };
};

// const getMessagesDBV1 = async (slug, limit = 30, userID) => {
//   const channel = await channelModel.aggregate([
//     { $match: { slug } },
//     { $unwind: '$chat' },
//     { $sort: { 'chat.time': -1 } },
//     { $limit: limit + 1 }, // Fetch one more than the limit to check for more items
//     {
//       $lookup: {
//         from: 'admins',
//         localField: 'chat.admin',
//         foreignField: '_id',
//         as: 'admin',
//       },
//     },
//     {
//       $addFields: {
//         'chat.admin': {
//           _id: { $arrayElemAt: ['$admin._id', 0] },
//           name: {
//             $concat: [
//               { $arrayElemAt: ['$admin.first_nm', 0] }, // First name
//               ' ',
//               { $arrayElemAt: ['$admin.last_nm', 0] }, // Last name
//             ],
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: '$_id',
//         name: { $first: '$name' },
//         slug: { $first: '$slug' },
//         chat: { $push: '$chat' },
//         status: { $first: '$status' },
//         trash: { $first: '$trash' },
//         createdAt: { $first: '$createdAt' },
//         updatedAt: { $first: '$updatedAt' },
//       },
//     },
//   ]);

//   let more = false;
//   if (channel[0]) {
//     // Check if there are more items beyond the limit
//     more = channel[0].chat.length > limit;
//     // Remove the extra item fetched for checking
//     channel[0].chat = channel[0].chat.slice(0, limit);
//   }

//   return {
//     messages: channel[0]?.chat || [],
//     more: more,
//   };
// };

export default getMessagesDB;
