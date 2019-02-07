// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const Metric = require("../models/Metric");

mongoose
  .connect('mongodb://localhost/module2-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let metrics = [
  {
    name: "ga:users",
    UIname: "Number of users",
    APIname: "google"
  },
  {
    name: "ga:sessions",
    UIname: "Number of sessions",
    APIname: "google"
  },
  {    
    name: "ga:sessionDuration",
    UIname: "Session Duration",
    APIname: "google"
  }
]

Metric.deleteMany()
.then(() => {
  return Metric.create(metrics)
})
.then(metricsCreated => {
  console.log(`${metricsCreated.length} users created with the following id:`);
  console.log(metricsCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})