import express from 'express';

import { protect } from '../middleware/auth';

import { addQuiz } from '../controllers/QuizController';

const router = express.Router();

router.post('/add', addQuiz);

export default router;
