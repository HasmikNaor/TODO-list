const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router(); // creates a new router object. Once we create this object, we can attach our handlers to it
const {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  updateIsTodoDone
} = require('../conrollers/todos');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/todos', getTodos);

router.post('/todos', celebrate({
  body: Joi.object().keys({
    todo: Joi.string().required().min(2).max(30),
  }),
}), createTodo);

router.delete('/todos/:todoId', celebrate({
  params: Joi.object().keys({
    todoId: Joi.string().length(24).hex(),
  }),
}), deleteTodo);

router.patch('/todos/:todoId', celebrate({
  params: Joi.object().keys({
    todoId: Joi.string().length(24).hex(),
  }),
}), updateTodo);

router.put('/todos/:todoId', celebrate({
  params: Joi.object().keys({
    todoId: Joi.string().length(24).hex(),
  }),
}), updateIsTodoDone);



module.exports = router;