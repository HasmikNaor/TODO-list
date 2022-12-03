const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const mongoose = require('mongoose');
const AuthError = require('../errors/auth.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const err = new AuthError('Authorization problem');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(err);
    return;
  }
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    next(err);
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // verifying the token
  } catch (e) {
    next(err);
    return;
  }
  payload._id = mongoose.Types.ObjectId(payload._id);
  req.user = payload; // This will ensure that the next middleware can see for whom this request was executed

  next();
};
