import express from 'express';
import asyncMiddleware from '../middleware/AsyncMiddleware';
import userService from '../services/UserService';

const router = express.Router();

/**
 * delete all users
 *
 * @author Nhat Bui
 */
export const deleteAllUsers = asyncMiddleware(async (req, res) => {
  const userSv = await userService.init();
  await userSv.deleteAllUser();
  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * get all users
 *
 * @author Nhat Bui
 */
export const getAllUsers = asyncMiddleware(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * delete User by Id
 *
 * @author Nhat Bui
 */
export const deleteUser = asyncMiddleware(async (req, res) => {
  const userSv = await userService.init();
  await userSv.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

export default router;
