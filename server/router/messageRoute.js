import express from 'express';
import { getMessage, sendMessage } from '../controller/messageController.js';

const router = express.Router();

// router.use(authMiddleware);

router.route('/').post(sendMessage).get(getMessage);

export default router;
