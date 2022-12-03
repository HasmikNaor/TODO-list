const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserNotFoundErr = require('../errors/user-not-found');
const EmailErr = require('../errors/email');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => UserNotFoundErr("users don't exist"))
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => UserNotFoundErr("this user doesn't exist"))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return EmailErr("this mail doesn't exist");
      }
      return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email: req.body.email,
          name: name,
          password: hash,
        })
          .then((user) => {
            const {
              name,
              email,
              _id,
            } = user;
            res.status(201).send({
              name,
              email,
              _id,
            });
          }));
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const id = req.user._id;
  const { name } = req.body;
  User.findByIdAndUpdate(id, { name }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => UserNotFoundErr("this user doesn't exist"))
    .then((user) => res.status(201).send(user))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id; // req.user is payload
  User.find({ _id: id })
    .orFail(() => UserNotFoundErr("this user doesn't exist"))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};
// check to see if a user is in the database then create a token
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
