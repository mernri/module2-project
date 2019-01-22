const express = require('express');
const router  = express.Router();


// Commentaire de Rita sur branche Rita 

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/datasources", (req, res, next) => {
  res.render("public-datasources");
});

module.exports = router;
