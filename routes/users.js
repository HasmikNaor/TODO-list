const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  getCurrentUser,
} = require('../conrollers/users');

const router = express.Router(); // creates a new router object. Once we create this object, we can attach our handlers to it

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/users/me', getCurrentUser);

router.get('/users', getUsers);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

module.exports = router;