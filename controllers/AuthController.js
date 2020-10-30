import express from 'express';
import asyncMiddleware from '../middleware/AsyncMiddleware';
import userService from '../services/UserService';
import SuccessResponse from '../model/response/SuccessResponse';
import ErrorResponse from '../model/response/ErrorResponse';
import EmailService from '../utils/SendEmail';
import crypto from 'crypto';

const router = express.Router();

/**
 * Register new user
 *
 * @author Nhat Bui
 */
export const register = asyncMiddleware(async (req, res) => {
  const { email, name, password } = req.body;

  const userSv = await userService.init();
  const emailSv = EmailService.init();

  const newUser = await userSv.createNewUser(email, name, password);
  // if (newUser) {
  //   const confirmToken = userSv.generateEmailConfirmToken();
  //   // console.log(confirmToken);
  //   const confirmUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/confirmemail?token=${confirmToken}`;
  //   await emailSv.sendEmail(email, 'Hello CC', confirmUrl);
  // }

  res.status(201).json(new SuccessResponse(201, 'Please check your mail ,and confirm your password', newUser));
});

/**
 * Login a user by email and password
 *
 * @author Nhat Bui
 */
export const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse(400, 'Please provide an email and password', 'validation'));
  }

  const userSv = await userService.init();

  const user = await userSv.getUserByEmail(email, '+password');

  if (user) {
    // if (!user.isEmailConfirmed) {
    //   return next(new ErrorResponse(400, 'Please check your mail to confirm account', 'validation'));
    // }

    const { _id, role, name, email } = user;
    if (await user.comparePassword(password)) {
      const payload = { _id, role, email, name };
      const token = userSv.getSignedJwtToken(payload);
      const refreshToken = userSv.getSignedRefreshToken(payload);
      // set cookie token
      const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }

      res
        .status(200)
        .cookie('token', token, options)
        .json(new SuccessResponse(200, 'Login success', { token, refreshToken }));
    } else {
      return next(new ErrorResponse(404, 'Password is incorrect', 'validation'));
    }
  } else {
    return next(new ErrorResponse(404, 'User is not found', 'validation'));
  }
});

/**
 * Logout / clear cookie
 *
 * @author Nhat Bui
 */
export const logout = asyncMiddleware(async (req, res) => {
  res.clearCookie('token');

  res.status(200).json({
    success: true,
  });
});

/**
 * get current User
 *
 * @author Nhat Bui
 */
export const getCurrentUser = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ErrorResponse(400, 'Please login', null));
  }
  res.status(200).json(new SuccessResponse(200, 'Get current user successfully', user));
});

/**
 * confirm email
 *
 * @author Nhat Bui
 */
export const confirmEmail = asyncMiddleware(async (req, res) => {
  const userSv = await userService.init();
  const { token } = req.query;
  if (!token) {
    return next(new ErrorResponse(400, 'Invalid Token', 'invalid'));
  }

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto.createHash('sha256').update(splitToken).digest('hex');

  // update user by token
  const user = await userSv.updateUser(
    {
      confirmEmailToken,
      isEmailConfirmed: false,
    },
    { confirmEmailToken: null, isEmailConfirmed: true }
  );
  res.status(200).json(new SuccessResponse(200, 'Confirm Email successfully', user));
});

/**
 * send forgot password tokens
 *
 * @author Nhat Bui
 */
export const forgotPassword = asyncMiddleware(async (req, res, next) => {
  const userSv = await userService.init();
  const emailSv = EmailService.init();
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse(400, 'Invalid Email', 'invalid'));
  }

  const user = await userSv.getUserByEmail(email);
  if (!user) {
    return next(new ErrorResponse(404, 'User Not Found', 'not_found'));
  }

  const resetToken = userSv.getResetPasswordToken();
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  await emailSv.sendEmail(email, 'Reset password request', message);
  await userSv.updateUser(
    { email },
    {
      resetPasswordToken: userSv.resetPasswordToken,
      resetPasswordExpire: userSv.resetPasswordExpire,
    }
  );
  return res.status(200).json(new SuccessResponse(200, 'Sent reset password link sucessfully!', {}));
});

/**
 * update reset password
 *
 * @author Nhat Bui
 */
export const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { resettoken } = req.params;
  const { password } = req.body;

  const userSv = await userService.init();

  const user = await userSv.checkResetPasswordToken(resettoken);

  if (!user) {
    return next(new ErrorResponse(404, 'Token is expired or invalid', 'invalid'));
  }

  user.password = password;
  user.resetPasswordExpire = null;
  user.resetPasswordToken = null;

  await user.save();

  return res.status(200).json(new SuccessResponse(200, 'Reset password successfully!', {}));
});

/**
 * update password
 *
 * @author Nhat Bui
 */
export const updatePassword = asyncMiddleware(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const userSv = await userService.init();

  const user = await userSv.getUserById(req.user._id, '+password');
  if (!user) {
    return next(new ErrorResponse(404, 'User is not found', 'not_found'));
  }

  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse(401, 'Password is incorrect', 'invalid'));
  }
  user.password = newPassword;
  await user.save();

  return res.status(200).json(new SuccessResponse(200, 'Update password successfully!', {}));
});

// export const checkRefreshToken = asyncMiddleware(async (req, res, next) => {
//   const { token } = req.body;
//   const userSv = await userService.init();
//   const refreshToken = userSv.refreshToken;
//   const decodeToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
//   if (token === decodeToken) {
//     // TODO: next here
//   }
// });

export default router;
