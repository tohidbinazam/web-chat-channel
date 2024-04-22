import express from 'express';
import {
  getAllSubscriptions,
  getSingleSubscription,
} from '../controller/subscriptionAppController.js';
import authAPPMiddleware from '../middleware/authAppMiddleware.js';

const router = express.Router();

// router.use(authAPPMiddleware);

router.route('/user/:id').get(getAllSubscriptions);
router.route('/:id').get(getSingleSubscription);

export default router;
