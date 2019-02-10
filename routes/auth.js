const express = require("express");

const passport = require("passport");

const router = express.Router();

const User = require("../models/User");

const Dashboard = require("../models/Dashboard");

const Metric = require("../models/Metric");



// Bcrypt to encrypt passwords

const bcrypt = require("bcrypt");

const bcryptSalt = 10;


<<<<<<< HEAD

=======
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
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
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

<<<<<<< HEAD


// redirects the user to his dashboard

router.get("/dashboard/ga-metrics", (req, res, next) => {

  User.findOne({ _id: req.user._id }, (err, user) => {

    // console.log(user);

    if (user) {

      res.render("auth/dashboard/ga-metrics", { user: user });

    } else {

      console.log("erreur");

    }

  });

=======
// log out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
});



// DASHBOARD CREATION - STEP 1 : define the name and the description of the dashboard

router.get("/dashboard/dashboardDescription", (req, res, next) => {

  User.findOne({ _id: req.user._id }, (err, user) => {

    if (user) {

      res.render(

        "auth/dashboard/dashboardDescription",

        {

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

        res.render("auth/dashboard/dashboardMetrics", {user: user, dashboard: dashboard });

      } else {

        console.log("erreur");

      }

    });

  });

});



// DASHBOARD CREATION - STEP 3 : select metrics

router.get("/dashboard/dashboardMetrics/:id", (req, res, next) => {

  User.findOne({ _id: req.user._id }, (err, user) => {

    // console.log(user);

    if (user) {

      res.render("auth/dashboard/dashboardMetrics", {

        user: user,

        dashboard: req.params.id

      });

    } else {

      console.log("erreur");

    }

  });

});

<<<<<<< HEAD




// _________ PAS BON : ne remplit pas le tableau de metrics du dashboard en question _________

=======
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
router.post("/dashboard/dashboardMetrics", (req, res, next) => {

  // console.log(req.body);

  Dashboard.findOne({ _id: req.body.dashboardid }, (err, dashboard) => {

    

    // console.log(dashboard);

    if (dashboard) {

      // Tableau des id des metrics

      var metrics_id = [];

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

                res.render("auth/dashboard/ga-metrics", {dashboard: dashboard, user: user });

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

<<<<<<< HEAD


router.get("/signup", (req, res, next) => {

  res.render("auth/signup");

});



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

=======

// redirects the user to his dashboard
router.get("/dashboard/ga-metrics", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    // console.log(user);
    if (user) {
      res.render("auth/dashboard/ga-metrics", { user: user });
    } else {
      console.log("erreur");
    }
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
  });

});


<<<<<<< HEAD

// Voir la page de profil

=======
// See page de profil
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
router.get("/profile", (req, res, next) => {

  User.findOne({ _id: req.user._id }, (err, user) => {

    // console.log(user);

    if (user) {

<<<<<<< HEAD
      res.render("auth/profile", { user: user });

=======
    Dashboard.find({owner: req.user._id }, (err, dashboards) => {
      console.log("le dashboard qui a comme owner mon user est : " + '\n' + dashboards);
      res.render("auth/profile", { user: user, dashboards: dashboards });
    })
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a
    } else {

      console.log("erreur");

    }

  });

});

<<<<<<< HEAD


router.get("/logout", (req, res) => {

  req.logout();

  res.redirect("/");

});
=======
>>>>>>> de4517e5cafa7e2e1c9b48b8036bb9822d01d92a



module.exports = router;

