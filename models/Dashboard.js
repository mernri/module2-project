const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const dashboardSchema = new Schema({
  name: String,
  description: String,
  owner: String,
  metrics: Array,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard ;
