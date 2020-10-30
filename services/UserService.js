import GenericRepository from '../database/repository/GenericRepository';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';

export default class UserService {
  /**
   * Start the service.
   *
   * @author Nhat Bui
   */
  static async init() {
    try {
      this.repository = await GenericRepository.init();
      return this;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Returns a user registered in the system by email.
   *
   * @author Nhat Bui
   */
  static async getUserByEmail(email, params) {
    try {
      return await this.repository.findOne(User, { email }, params);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Returns a user registered in the system by id.
   *
   * @author Nhat Bui
   */
  static async getUserById(id, fields) {
    try {
      return await this.repository.findById(User, id, fields);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * get all users
   *
   * @author Nhat Bui
   */
  static async getAllUser() {
    try {
      return await this.repository.find(User, {});
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Create a new user.
   *
   * @author Nhat Bui
   */
  static async createNewUser(email, name, password) {
    this.confirmationToken = crypto.randomBytes(20).toString('hex');
    const confirmEmailToken = crypto.createHash('sha256').update(this.confirmationToken).digest('hex');
    try {
      const user = new User({
        name,
        email,
        password,
        confirmEmailToken,
      });

      return await this.repository.create(User, user);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Delete a user by id.
   *
   * @author Nhat Bui
   */
  static async deleteUser(id) {
    try {
      return await this.repository.deleteById(User, { _id: id });
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Delete all user.
   *
   * @author Nhat Bui
   */
  static async deleteAllUser() {
    try {
      return await this.repository.deleteAll(User);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Update a user.
   *
   * @author Nhat Bui
   */
  static async updateUser(paramSearch, dataUpdate) {
    try {
      return await this.repository.update(User, paramSearch, dataUpdate);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * generate email confirm token
   *
   * @author Nhat Bui
   */
  static generateEmailConfirmToken() {
    try {
      const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
      const confirmTokenCombined = `${this.confirmationToken}.${confirmTokenExtend}`;
      return confirmTokenCombined;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * sign JWT
   *
   * @author Nhat Bui
   */
  static getSignedJwtToken(payload) {
    try {
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * sign Refresh token
   *
   * @author Nhat Bui
   */
  static getSignedRefreshToken(payload) {
    try {
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      });
      // store token to redis or somewhere else
      this.refreshToken = refreshToken;
      this.token = crypto.createHash('sha256').update(refreshToken).digest('hex');
      return this.token;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * sign JWT
   *
   * @author Nhat Bui
   */
  static async findConfirmToken(payload) {
    try {
      return await this.repository.find(payload);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * get reset password token
   *
   * @author Nhat Bui
   */
  static getResetPasswordToken() {
    try {
      const resetToken = crypto.randomBytes(20).toString('hex');
      // Hash token and set to resetPasswordToken field
      this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Set expire
      this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

      return resetToken;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * check reset password token
   *
   * @author Nhat Bui
   */
  static async checkResetPasswordToken(token) {
    try {
      const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      return this.repository.findOne(User, { resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    } catch (ex) {
      throw ex;
    }
  }
}
