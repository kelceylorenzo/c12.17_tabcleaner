const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LocalUser = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
      type: String,
      required: true
  },
  image: {
    type: String
  }
});

// Create collection and add schema
mongoose.model('localUsers', LocalUserSchema);