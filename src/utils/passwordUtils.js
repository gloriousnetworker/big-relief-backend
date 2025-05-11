const bcrypt = require('bcryptjs');
const { ErrorHandler } = require('./errorHandler');

const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new ErrorHandler(500, 'Error hashing password');
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new ErrorHandler(500, 'Error comparing passwords');
  }
};

module.exports = { hashPassword, comparePassword };