import express from 'express';
import { addRole, getRoles, deleteAllRoles } from '../controllers/RoleController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getRoles).post(addRole).delete(deleteAllRoles);

export default router;
