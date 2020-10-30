import jwt from 'jsonwebtoken';
import asyncMiddleware from './AsyncMiddleware';
import user from '../services/UserService';
import ErrorResponse from '../model/response/ErrorResponse';

/**
 * Protect auth
 * @author Nhat Bui
 */
export const protect = asyncMiddleware(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    next(new ErrorResponse(401, 'Not authorized', 'authorized'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userService = await user.init();
    const _user = await userService.getUserById(decoded._id);
    // check refresh token in DB
    req.user = _user;
    next();
  } catch (err) {
    return next(new ErrorResponse(401, 'Not authorized', 'authorized'));
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(403, `User role ${req.user.role} is not authorized to access this route`, 'authorized')
      );
    }
  };
};
