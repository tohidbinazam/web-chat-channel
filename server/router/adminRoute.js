import express from 'express';
import {
  createAdmin,
  deleteAdminById,
  getAllAdmins,
  getAdminById,
  updateAdminById,
} from '../controller/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getAllAdmins).post(createAdmin);
router
  .route('/:id')
  .get(getAdminById)
  .delete(deleteAdminById)
  .patch(updateAdminById);

export default router;
