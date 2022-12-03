const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, Segments, errors } = require('celebrate');
const cors = require('cors');
const { createUser, login } = require('./conrollers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validator = require('validator');

const ResourceNotFoundErr = require('./errors/resource-not-found');

mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

const usersRoutes = require('./routes/users'); //To be able to use our routing,
const todosRoutes = require('./routes/todos');

// listen to port 3000
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(cors());
app.options('*', cors()); // enable requests for all routes

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

app.use(requestLogger); // enabling the request logger

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(usersRoutes);
app.use(todosRoutes);

app.use((req, res, next) => {
  next(new ResourceNotFoundErr('resource not found'));
});

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use((err, req, res, next) => {
  return res.status(err.statusCode).send({ name: err.name, message: err.message });
});

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
})
