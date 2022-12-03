const ValidationError = require('../errors/validation-error');
const Todo = require('../models/todo');
const user = require('../models/user');

const todoNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getTodos = (req, res, next) => {
  Todo.find({})
    .orFail(() => todoNotFoundHandler())
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createTodo = (req, res, next) => {
  const { todo } = req.body;
  const owner = req.user._id;
  Todo.create({ todo, owner })
    .then((todo) => {
      res.status(201).send(todo);
    })
    .catch(next);
};

module.exports.deleteTodo = (req, res, next) => {
  const { todoId } = req.params;
  Todo.findById(todoId)
    .orFail(() => todoNotFoundHandler())
    .then((todo) => {
      if (todo.owner.equals(req.user._id)) {
        Todo.findByIdAndDelete(todoId)
          .orFail(() => todoNotFoundHandler())
          .then((todo) => res.status(201).send(todo))
          .catch(next);
      } else {
        throw new ValidationError('Forbidden');
      }
    })
    .catch(next);
};

module.exports.updateTodo = (req, res, next) => {
  const { todoId } = req.params;
  Todo.findById(todoId)
    .orFail(() => todoNotFoundHandler())
    .then((todo) => {
      if (todo.owner.equals(req.user._id)) {
        Todo.findByIdAndUpdate(todoId, { todo: req.body.todo }, {
          new: true,
          runValidators: true,
          upsert: true,
        })
          .orFail(() => todoNotFoundHandler())
          .then((todo) => res.status(201).send(todo))
          .catch(next);
      } else {
        throw new ValidationError('Forbidden');
      }
    })
    .catch(next);
}

module.exports.updateIsTodoDone = (req, res, next) => {
  const { todoId } = req.params;
  Todo.findById(todoId)
    .orFail(() => todoNotFoundHandler())
    .then((todo) => {
      if (todo.owner.equals(req.user._id)) {
        Todo.findByIdAndUpdate(todoId, { isDone: !todo.isDone }, {
          new: true,
          runValidators: true,
          upsert: true,
        })
          .orFail(() => todoNotFoundHandler())
          .then((todo) => res.status(201).send(todo))
          .catch(next);
      } else {
        throw new ValidationError('Forbidden');
      }
    })
    .catch(next);
};

