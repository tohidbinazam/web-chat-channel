// // Iterate through subscriptions and get chat message based on conditions
// const updatedSubscriptions = data.subscription
//   .filter((sub) => sub.channel)
//   .map((sub) => {
//     let chat = null;
//     let info = null;

//     if (new Date(sub.endDate) < Date.now()) {
//       info = `Your ${sub.plan} subscription has expired.`; // If subscription has ended
//     } else if (!sub.status) {
//       info =
//         'Your subscription is currently inactive. Please contact support.'; // If subscription status is false
//     } else if (sub.channel.chat && sub.channel.chat.length > 0) {
//       chat = sub.channel.chat[0]; // If chat array has messages
//     } else {
//       info = 'No messages available.'; // If chat is empty
//     }

//     return {
//       ...sub.toJSON(),
//       channel: {
//         ...sub.channel.toJSON(),
//         chat,
//         info,
//       },
//     };
//   });

// const token = generateToken(data._id, '365d');
// const user = {
//   ...data.toJSON(),
//   subscription: updatedSubscriptions,
// };
