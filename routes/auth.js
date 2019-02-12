const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Dashboard = require("../models/Dashboard");
const Metric = require("../models/Metric");

// Bcrypt to encrypt passwords

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Signup form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Creates a user
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

// Login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

// If login is ok, the user is redirected to his profile

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// log out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// DASHBOARD CREATION - STEP 1 : define the name and the description of the dashboard

router.get("/dashboard/dashboardDescription", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (user) {
      res.render("auth/dashboard/dashboardDescription", {
        user: user,
        message: req.flash("error")
      });
    } else {
      console.log("erreur");
    }
  });
});

router.post("/dashboard/dashboardDescription", (req, res, next) => {
  const userid = req.user._id;
  const dashboardname = req.body.dashboardname;
  const dashboarddescription = req.body.dashboarddescription;

  const newDashboard = new Dashboard({
    owner: userid,
    name: dashboardname,
    description: dashboarddescription
  });

  newDashboard.save().then(dashboard => {
    res.redirect("dashboardDatasources/" + dashboard._id);
  });
});

// DASHBOARD CREATION - STEP 2 : select datasources

router.get("/dashboard/dashboardDatasources/:id", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    // console.log(user)

    if (user) {
      res.render("auth/dashboard/dashboardDatasources", {
        user: user,
        dashboard: req.params.id
      });
    } else {
      console.log("erreur");
    }
  });
});

router.post("/dashboard/dashboardDatasources", (req, res, next) => {
  // console.log(req.body);
  Dashboard.findOne({ _id: req.body.dashboardid }, (err, dashboard) => {
    // console.log(dashboard);
    User.findOne({ _id: req.user._id }, (err, user) => {
      // console.log(user);
      if (user) {
        res.render("auth/dashboard/dashboardMetrics", {
          user: user,
          dashboard: dashboard
        });
      } else {
        console.log("erreur");
      }
    });
  });
});

// DASHBOARD CREATION - STEP 3 : select metrics

router.get("/dashboard/dashboardMetrics/:id", (req, res, next) => {
  Dashboard.findOne({ _id: req.params.id }, (err, dashboard) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
      // console.log(user);
      if (user) {
        res.render("auth/dashboard/dashboardMetrics:id", {
          user: user,
          dashboard: req.params.id
        });
      } else {
        console.log("erreur");
      }
    });
  });
});

router.post("/dashboard/dashboardMetrics", (req, res, next) => {
  // console.log(req.body);
  Dashboard.findOne({ _id: req.body.dashboardid }, (err, dashboard) => {
    // console.log(dashboard);
    if (dashboard) {
      // Tableau des id des metrics
      //var metrics_id = [];
      var promises = [];

      req.body.metrics.forEach(metric => {
        promises.push(Metric.findOne({ name: metric }));
      });

      Promise.all(promises).then(results => {
        const metricids = results.map(metric => metric._id);

        console.log(metricids);

        Dashboard.findByIdAndUpdate(
          dashboard._id,

          {
            $push: { metrics: metricids }
          },

          { new: true }
        )

          .populate("metrics")

          .then(dashboard => {
            console.log(dashboard);

            User.findOne({ _id: req.user._id }, (err, user) => {
              // console.log(user);

              if (user) {
                res.render("auth/dashboard/ga-metrics", {
                  dashboard: dashboard,
                  user: user
                });
              } else {
                console.log("erreur");
              }
            });
          })

          .catch(err => {
            console.log(err);
          });
      });
    } else {
      console.log("erreur");
    }
  });
});

// See page de profil
router.get("/profile", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    // console.log(user);
    if (user) {
      Dashboard.find({ owner: req.user._id }, (err, dashboards) => {
        res.render("auth/profile", { user: user, dashboards: dashboards });
      });
    } else {
      console.log("erreur");
    }
  });
});

// THIS ROUTE DOESN'T WORK FOR THE MOMENT
// redirects the user to a specific dashboard
router.get("/dashboard/ga-metrics/", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (user) {
      res.render("auth/dashboard/ga-metrics", {
        user: user
      });
    } else {
      console.log("erreur");
    }
  });
});

//  POST route to delete a dashboard
router.post("/dashboard/:id/delete", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    let dashboardid = req.params.id;
    Dashboard.findByIdAndRemove({ _id: dashboardid }).then(dashboard => {
      res.redirect("/auth/profile");
    });
  }).catch(error => {
    console.log(error);
  });
});

/* GET route to edit dashboard */
router.get("/dashboard/:id/edit", (req, res, next) => {
  Dashboard.findOne({ _id: req.params.id })
    .then(dashboard => {
      res.render("auth/dashboard/edit", { dashboard: dashboard });
    })
    .catch(error => {
      console.log(error);
    });
});

/* POST route to edit dashboard */
router.post("/dashboard/:id", (req, res, next) => {
  const { name, description } = req.body;
  var promises = [];

  req.body.metrics.forEach(metric => {
    promises.push(Metric.findOne({ name: metric }));
  });

  Promise.all(promises).then(results => {
    const metricids = results.map(metric => metric._id);
    Dashboard.findByIdAndUpdate(req.params.id, {
      name,
      description,
      metrics: metricids
    })
      .then(dashboard => {
        res.redirect("/auth/profile");
      })
      .catch(error => {
        console.log(error);
      });
  });
});

module.exports = router;
