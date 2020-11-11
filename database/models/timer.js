const mongoose = require('mongoose')

const timerSchema = mongoose.Schema({
  hour: {
    type: Number,
    index: true,
    unique: true,
    required: true
  },
  mins: [{
    users: Array
  }]
}, {
  timestamps: true
})

module.exports = timerSchema
