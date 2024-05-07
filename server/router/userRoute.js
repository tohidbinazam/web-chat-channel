import express from 'express';
import {
  createUser,
  deleteUserById,
  findUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import permissionMiddleware from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.use(authMiddleware, permissionMiddleware('user'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/find').post(findUser);
router
  .route('/:id')
  .get(getUserById)
  .delete(deleteUserById)
  .patch(updateUserById);

export default router;
