const mongoose = require('mongoose')

const meetingSchema = mongoose.Schema({
  locked: Boolean,
  topic: String,
  time: String,
  created: String,
  text: String,
  date: String,
  url: String
}, {
  timestamps: true
})

module.exports = meetingSchema