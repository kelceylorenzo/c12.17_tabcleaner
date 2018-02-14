const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TabsSchema= new Schema({
  databaseTabID: {
    type: Number,
    required: true
  },
  windowID: {
    type: String,
    required: true
  },
  sessionID: {
    type: String,
    required: true
  },
  tabTitle: {
    type: String,
    required: true
  },
  urlID: {
    type: Number,
    required: true
  },
  activeTimeElapsed: {
    type: Number,
    required: true
  },
  inactiveTimeElapsed: {
    type: Number,
    required: true
  },
  googleTabIndex: {
    type: Number,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
});

// Create collection and add schema
mongoose.model('Tabs', TabsSchema);