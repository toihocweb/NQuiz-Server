import GenericRepository from '../database/repository/GenericRepository';

import Role from '../database/models/Role';

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
   * Returns a role registered in the system by role_name.
   *
   * @author Nhat Bui
   */
  static async getRoleByName(role_name) {
    try {
      return await this.repository.findOne(Role, { role_name });
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * get all roles
   *
   * @author Nhat Bui
   */
  static async getAllRoles() {
    try {
      return await this.repository.find(Role, {});
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Create a new user.
   *
   * @author Nhat Bui
   */
  static async createNewRole(role_name, role_desc) {
    try {
      const role = new Role({
        role_name,
        role_desc,
      });

      return await this.repository.create(Role, role);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Create a new user.
   *
   * @author Nhat Bui
   */
  static async deleteAllRole() {
    try {
      return await this.repository.deleteAll(Role);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Update a role.
   *
   * @author Nhat Bui
   */
  static async updateRole(paramSearch, dataUpdate) {
    try {
      return await this.repository.update(Role, paramSearch, dataUpdate);
    } catch (ex) {
      throw ex;
    }
  }
}
