import express from 'express';
import { userFilter } from '../controller/filterController.js';

const router = express.Router();

// router.use(authMiddleware);

router.route('/').post(userFilter);

export default router;
