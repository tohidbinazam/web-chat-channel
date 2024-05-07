import express from 'express';
import {
  createChannel,
  deleteChannelById,
  getAllChannels,
  getChannelById,
  updateChannelById,
  getChatBySlugAPI,
  sendMessageAPI,
} from '../controller/channelController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import permissionMiddleware from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.use(authMiddleware, permissionMiddleware('channels'));

router.route('/').get(getAllChannels).post(createChannel);
router
  .route('/:id')
  .get(getChannelById)
  .delete(deleteChannelById)
  .patch(updateChannelById);
router.route('/chat/:slug/:limit?').get(getChatBySlugAPI).patch(sendMessageAPI);

export default router;
