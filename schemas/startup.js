'use strict'

var mongoose = require('mongoose');

var startupSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  lat: Number,
  lng: Number,
  icon: String,
  url: String,
  batch: String,
  crunchbase_url: String
});

module.exports = mongoose.model('Startup', startupSchema);