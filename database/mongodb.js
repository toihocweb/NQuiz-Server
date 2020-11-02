import mongoose from 'mongoose';

export default class DatabaseConnection {
  /**
   * Connect to MongoDB.
   *
   * @author Nhat Bui
   */
  static async getConnection() {
    try {
      if (!mongoose.connection.readyState) {
        mongoose
          .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
          })
          .then(() => console.log(`Database Connected ${mongoose.connection.host}`.bgCyan))
          .catch((err) => console.log(`Error connect DB: ${err}`.red));
      }
    } catch (ex) {
      throw ex;
    }
  }
}
