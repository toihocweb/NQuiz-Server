import express from 'express';
import {
  login,
  register,
  logout,
  getCurrentUser,
  confirmEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/AuthController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/confirmemail', confirmEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/logout', logout);
router.get('/current', protect, getCurrentUser);

export default router;
