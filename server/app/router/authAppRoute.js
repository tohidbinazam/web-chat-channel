import express from 'express';
import {
  changePassword,
  checkPassword,
  forgotPassword,
  login,
  logout,
  me,
  resetPassword,
  updateProfile,
} from '../controller/authAppController.js';
import authAPPMiddleware from '../middleware/authAppMiddleware.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/logout').get(authAPPMiddleware, logout);
router.route('/password').post(forgotPassword);
router.route('/password/:token').post(resetPassword);
router.route('/me').get(authAPPMiddleware, me);
router.route('/:id').post(checkPassword).patch(changePassword);
router.route('/update/:id').post(updateProfile);

export default router;
