import GenericRepository from '../database/repository/GenericRepository';
import Quiz from '../database/models/Quiz';

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
   * Returns a quiz registered in the system by id.
   *
   * @author Nhat Bui
   */
  static async getQuizById(id, fields) {
    try {
      return await this.repository.findById(Quiz, id, fields);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * get all quizs
   *
   * @author Nhat Bui
   */
  static async getAllQuiz() {
    try {
      return await this.repository.find(Quiz, {});
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Create a new quiz.
   *
   * @author Nhat Bui
   */
  static async createNewQuiz(quiz_desc, quiz_anwsers, quiz_correct, quiz_categories) {
    try {
      const quiz = new Quiz({
        quiz_desc,
        quiz_anwsers,
        quiz_categories,
        quiz_correct,
      });

      return await this.repository.create(Quiz, quiz);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Delete a quiz by id.
   *
   * @author Nhat Bui
   */
  static async deleteQuiz(id) {
    try {
      // delete quiz in quiz_collection
      return await this.repository.deleteById(Quiz, { _id: id });
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Delete all quiz.
   *
   * @author Nhat Bui
   */
  static async deleteAllQuiz() {
    try {
      return await this.repository.deleteAll(Quiz);
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Update a quiz.
   *
   * @author Nhat Bui
   */
  static async updateQuiz(paramSearch, dataUpdate) {
    try {
      return await this.repository.update(Quiz, paramSearch, dataUpdate);
    } catch (ex) {
      throw ex;
    }
  }
}
