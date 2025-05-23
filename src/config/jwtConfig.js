// src/config/jwtConfig.js
require('dotenv').config();

module.exports = {
  secret:        process.env.JWT_SECRET,
  expiresIn:     process.env.JWT_EXPIRES_IN || '1d',

  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};
