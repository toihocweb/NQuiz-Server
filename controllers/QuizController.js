import express from 'express';
import asyncMiddleware from '../middleware/AsyncMiddleware';
import SuccessResponse from '../model/response/SuccessResponse';
import quizService from '../services/QuizService';

const router = express.Router();

/**
 * Register new quiz
 *
 * @author Nhat Bui
 */
export const addQuiz = asyncMiddleware(async (req, res) => {
  const { quiz_desc, quiz_anwsers, quiz_correct, quiz_categories } = req.body;

  const sQuiz = await quizService.init();

  const quiz = await sQuiz.createNewQuiz(quiz_desc, quiz_anwsers, quiz_correct, quiz_categories);

  res.status(201).json(new SuccessResponse(201, 'Add new Quiz successfully', quiz));
});

export default router;
