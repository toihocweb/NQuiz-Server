import express from 'express';
import { deleteAllUsers, deleteUser, getAllUsers } from '../controllers/UserController';
import User from '../database/models/User';
import advancedResults from '../middleware/advancedResults';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.delete('/', deleteAllUsers);
router
  .route('/')
  .delete(deleteAllUsers)
  .get(
    advancedResults(User, {
      path: 'role_detail',
      select: '_id role_name role_desc',
    }),
    getAllUsers
  );

router.route('/:id').delete(deleteUser);

export default router;
