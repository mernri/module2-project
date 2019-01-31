const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const dashboardSchema = new Schema({
  userid: String,
  name: String,
  description: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard ;
