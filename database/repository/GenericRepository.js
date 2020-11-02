import db from '../connectdb';

export default class GenericRepository {
  /**
   * Start the repository.
   *
   * @author Nhat Bui
   */
  static async init() {
    await db.getConnection();
    return this;
  }

  /**
   * Returns all records found in the desired model based on the parameters sent.
   *
   * @author Nhat Bui
   */
  static async find(model, params) {
    return await model.find(params);
  }

  /**
   * Searches for the parameters in the desired model and returns the first record found.
   *
   * @author Nhat Bui
   * @param {*} model
   * @param {*} params
   * @param {*} fields
   */
  static async findOne(model, params, fields) {
    return await model.findOne(params).select(fields);
  }

  /**
   * Search data by id.
   *
   * @author Nhat Bui
   */
  static async findById(model, params, fields) {
    return await model.findById(params).select(fields);
  }

  /**
   * Create a new data.
   *
   * @author Nhat Bui
   */
  static async create(model, params) {
    return await model.create(params);
  }

  /**
   * Get count of registers based on received parameter.
   *
   * @author Nhat Bui
   * @param {*} model
   * @param {*} params
   */
  static async count(model, params) {
    return await model.countDocuments(params);
  }

  /**
   * Delete data by id.
   *
   * @author Nhat Bui
   */
  static async deleteById(model, params) {
    return await model.findOneAndDelete({ _id: params });
  }

  /**
   * Delete data.
   *
   * @author Nhat Bui
   */
  static async delete(model, params) {
    return await model.deleteOne(params);
  }

  /**
   * Delete all data.
   *
   * @author Nhat Bui
   */
  static async deleteAll(model) {
    return await model.deleteMany();
  }

  /**
   * Update a register.
   *
   * @author Nhat Bui
   * @param {*} paramsSearch
   * @param {*} paramsUpdate
   */
  static async update(model, paramsSearch, paramsUpdate) {
    return await model.findOneAndUpdate(paramsSearch, paramsUpdate, {
      runValidators: true,
    });
  }
}
