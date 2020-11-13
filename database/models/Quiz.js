import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    quiz_desc: {
      type: String,
      required: true,
    },
    quiz_anwsers: [String],
    quiz_correct: {
      type: String,
      required: true,
    },
    quiz_categories: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Quiz', quizSchema);
