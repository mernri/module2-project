const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const metricSchema = new Schema({
  name: String,
  UIname: String,
  APIname: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Metric = mongoose.model('Metric', metricSchema);
module.exports = Metric ;
