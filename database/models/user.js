const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
  blocked: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  payments: Array,
  exp: String,
  tests: Array,
  courses: [{
    course: Number,
    code: Number,
    name: String,
    active: Boolean,
    date: String,
    tests: Array
  }],
  time: String,
  interval: Number,
  spam: Boolean,
  timezone: String,
  club: {
    participant: Boolean,
    attended: Array
  },
  admin: Boolean,
  invited: Array,
  locale: String,
  key: String,
  day: Number,
  from: String
}, {
  timestamps: true
})

module.exports = userSchema
