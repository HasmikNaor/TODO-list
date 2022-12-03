const { boolean } = require('joi');
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('todo', todoSchema);
