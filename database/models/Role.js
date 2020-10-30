import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
    },
    role_desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Role', roleSchema);
