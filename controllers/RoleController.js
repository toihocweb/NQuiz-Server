import express from 'express';
import asyncMiddleware from '../middleware/AsyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import roleService from '../services/RoleService';

const router = express.Router();

/**
 * Add new role
 *
 * @author Nhat Bui
 */
export const addRole = asyncMiddleware(async (req, res) => {
  const roleSv = await roleService.init();
  const { role_name, role_desc } = req.body;
  const role = await roleSv.createNewRole(role_name, role_desc);
  if (role) {
    return res.status(200).json(new SuccessResponse(200, 'Create Role Successfully', role));
  }
  return next(new ErrorResponse(400, 'Can not create new Role', 'internal'));
});

/**
 * Add new role
 *
 * @author Nhat Bui
 */
export const getRoles = asyncMiddleware(async (req, res) => {
  const roleSv = await roleService.init();
  const roles = await roleSv.getAllRoles();
  if (roles) {
    return res.status(200).json(new SuccessResponse(200, 'Get Roles Successfully', roles));
  }
});

/**
 * delete all role
 *
 * @author Nhat Bui
 */
export const deleteAllRoles = asyncMiddleware(async (req, res) => {
  const roleSv = await roleService.init();
  await roleSv.deleteAllRole();
  return res.status(200).json(new SuccessResponse(200, 'Delete Roles Successfully', {}));
});

export default router;
