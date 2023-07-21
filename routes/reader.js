/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');

/**
 * @desc retrieves the current users
 */
/** ROUTER FOR THE AUTHOR/HOME PAGE  */
router.get("/homepage", (req, res, next) => {

  //Use this pattern to retrieve data
  //NB. it's better NOT to use arrow functions for callbacks with this library
  global.db.all("SELECT * FROM testUserRecords", function (err, rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.json(rows);
    }
  });
});

/**
 * @desc retrieves the current users
 */
/** ROUTER FOR THE AUTHOR/HOME PAGE  */
router.get("/articles", (req, res, next) => {

    //Use this pattern to retrieve data
    //NB. it's better NOT to use arrow functions for callbacks with this library
    global.db.all("SELECT * FROM testUsers", function (err, rows) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.json(rows);
      }
    });
  });

module.exports = router;