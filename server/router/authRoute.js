import express from 'express';
import {
  changePassword,
  checkPassword,
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPassword,
  updateProfile,
} from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(authMiddleware, logout);
router.route('/password').post(forgotPassword);
router.route('/password/:token').post(resetPassword);
router.route('/me').get(authMiddleware, me);
router
  .route('/:id')
  .post(authMiddleware, checkPassword)
  .patch(authMiddleware, changePassword);
router.route('/update/:id').post(authMiddleware, updateProfile);

export default router;
