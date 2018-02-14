const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UrlSchema = new Schema({
  elapsedActiveTime: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  webSiteID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  favicon: {
    type: String,
    required: true
  },
});

// Create collection and add schema
mongoose.model('Urls', UrlSchema);