const mongoose = require('mongoose')

const chatUserSchema = mongoose.Schema({
  chat_id: {
    type: Number,
    index: true,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: String,
  username: String,
  name: String,
  age: String,
  lang: String,
  why: String,
  who: String,
  sex: String,
  native: String
}, {
  timestamps: true
})

module.exports = chatUserSchema
