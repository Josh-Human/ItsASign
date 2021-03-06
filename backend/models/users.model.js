const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    picture: { type: String, default: 'avatar1' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
      completed_lessons: { type: Array, default: 1 },
      total_xp: {
        type: Number,
        min: 1,
        max: 999999,
        default: 1,
      },
      badges: { type: Array },
    },
  },
  {
    timestamps: true,
  },
);

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // 10 rounds
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Hashing failed', error);
  }
};

const Users = mongoose.model('User', userSchema);
// converting the raw table into a workable model
// with model(<name>, <schemaUsed>)

module.exports = { Users, hashPassword };
