
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');
const { format } = require('date-fns');


// Define the articles variable here at a higher scope
// let articles = [];


router.get("/home", (req, res, next) => {
  global.db.all("SELECT * FROM existArticle", function (err, rows) {
    if (err) {
      return next(err);
    } else {
      const articles = rows.map(article => {
        return {
          ...article,
          article_created: format(new Date(article.article_created), 'dd MMMM yyyy'),
          article_last_modified: format(new Date(article.article_last_modified), 'dd MMMM yyyy, hh:mm:ss a')
        };
      });
      res.render('home', { articles : articles, format : format}); 
    }
  });
});
 



router.get("/edit-article/:id", (req, res, next) => {
  const editId = req.params.id; // Retrieve the edit ID from the URL parameter

  // Query the database to fetch the specific edit based on the editId
  global.db.get("SELECT * FROM existArticle WHERE article_id = ?", [editId], (err, edit) => {
    if (err) {
      next(err);
    } else if (!edit) {
      res.status(404).send('Edit not found.');
    } else {
      edit.article_created = format(new Date(edit.article_created), 'dd MMMM yyyy');
      edit.article_last_modified = format(new Date(edit.article_last_modified), 'dd MMMM yyyy, hh:mm:ss a');

      res.render('edit-article', { article: edit });
    }
  });
  console.log('edit article page is working');
});


router.post("/submit-article/:id", (req, res, next) => {
  //The editId variable stores the article ID that is extracted from the URL parameter ":id".
  const editId = req.params.id; // retreive the edit it from the url parameter. 
  const {
    article_title,
    article_subtitle,
    article_action
  } = req.body;
  // Get the current date and time
  const currentDate = new Date();
  const article_last_modified = format(currentDate, 'dd MMMM yyyy, hh:mm:ss a');
  // Update the database with the edited data
  // Replace the following code with your actual database update operation
  global.db.run(
    "UPDATE existArticle SET article_title = ?, article_subtitle = ?, article_action = ?, article_last_modified = ? WHERE article_id = ?",
    [article_title, article_subtitle, article_action, article_last_modified, editId],
    function (err) {
      if (err) {
        next(err); // Send the error on to the error handler
      } else {
        res.redirect("/author/home"); // Redirect the user back to the "/home" page after the update
      }
    }
  );
  console.log("submit is working");
});





///////////////////////////////////////////// HELPERS ///////////////////////////////////////////

/**
 * @desc A helper function to generate a random string
 * @returns a random lorem ipsum string
 */
function generateRandomData(numWords = 5) {
  const str =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const words = str.split(" ");

  let output = "";

  for (let i = 0; i < numWords; i++) {
    output += choose(words);
    if (i < numWords - 1) {
      output += " ";
    }
  }

  return output;
}

/**
 * @desc choose and return an item from an array
 * @returns the item
 */
function choose(array) {
  assert(Array.isArray(array), "Not an array");
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

module.exports = router;
