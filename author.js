

const express = require("express");
const router = express.Router();
const assert = require('assert');
const { format } = require('date-fns');



router.get("/home", (req, res, next) => {
  global.db.all("SELECT setting_title, setting_subtitle, setting_author_name FROM userSetting", function (err, rows) {
    if (err) {
      return next(err);
    } else {
      const settings = rows;

      // Retrieve draft articles (where is_published is 0)
      global.db.all("SELECT * FROM existArticle WHERE is_published = 0", function (err, draftRows) {
        if (err) {
          return next(err);
        } else {
          const draftArticles = draftRows.map(article => {
            return {
              ...article,
              article_created: format(new Date(article.article_created), 'dd MMMM yyyy'),
              article_last_modified: format(new Date(article.article_last_modified), 'dd MMMM yyyy, hh:mm:ss a')
            };
          });

          // Retrieve published articles (where is_published is 1)
          global.db.all("SELECT * FROM existArticle WHERE is_published = 1", function (err, publishedRows) {
            if (err) {
              return next(err);
            } else {
              const publishedArticles = publishedRows.map(article => {
                return {
                  ...article,
                  article_created: format(new Date(article.article_created), 'dd MMMM yyyy'),
                  article_last_modified: format(new Date(article.article_last_modified), 'dd MMMM yyyy, hh:mm:ss a')
                };
              });

              res.render('home', { draftArticles: draftArticles, publishedArticles: publishedArticles, settings: settings, format: format });
            }
          });
        }
      });
    }
  });
});





router.get("/edit-article/:id", (req, res, next) => {
  const editId = req.params.id; // Retrieve the edit ID from the URL parameter

  
  // If editId is "new", render the template with emtpy inputs for a new article
  if (editId == 'new') {
    const newArticle = {
      article_id: 'new',
      article_created: format(new Date(), 'dd MMMM yyyy'), // Set the current date
      article_last_modified: format(new Date(), 'dd MMMM yyyy, hh:mm:ss a'), // Set the current date and time
      article_title: '',
      article_subtitle: '',
      article_action: ''
    };
    // Render the "edit-article.ejs" template with the newArticle object
    return res.render('edit-article', { article: newArticle });
  }
  
  
  
  
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
  const article_created = format(currentDate, 'dd MMMM yyyy');
  const article_last_modified = format(currentDate, 'dd MMMM yyyy, hh:mm:ss a');
  
  
  // If editId is "new", it means we are inserting a new article.
  if (editId === 'new') {
    // Insert the new article into the database
    global.db.run(
      "INSERT INTO existArticle (article_title, article_subtitle, article_created, article_last_modified, article_action) VALUES (?, ?, ?, ?, ?)",
      [article_title, article_subtitle, article_created, article_last_modified, article_action],
      function (err) {
        if (err) {
          next(err); // Send the error on to the error handler
        } else {
          // Redirect the user back to the "/home" page after the update
          res.redirect("/author/home");
        }
      }
    );
  } else {
    // If editId is not "new", it means we are updating an existing article.
    // Update the database with the edited data
    global.db.run(
      "UPDATE existArticle SET article_title = ?, article_subtitle = ?, article_action = ?, article_last_modified = ? WHERE article_id = ?",
      [article_title, article_subtitle, article_action, article_last_modified, editId],
      function (err) {
        if (err) {
          next(err); // Send the error on to the error handler
        } else {
          // Redirect the user back to the "/home" page after the update
          res.redirect("/author/home");
        }
      }
    );
  }

  console.log("submit is working");
});



router.delete("/delete-article/:id", (req, res, next) => {
  const articleId = req.params.id; // Retrieve the article ID from the URL parameter.

  // Delete the article from the database.
  global.db.run("DELETE FROM existArticle WHERE article_id = ?", [articleId], function (err) {
    if (err) {
      next(err); // Send the error on to the error handler
    } else {
      // Respond with a success status (HTTP 204 - No Content) after the deletion.
      res.sendStatus(204);
    }
  });
});


// Add a new route to publish an article
router.put("/publish-article/:id", (req, res, next) => {
  const articleId = req.params.id; // Retrieve the article ID from the URL parameter.

  // Update the article's "is_published" column to 1 (published)
  global.db.run("UPDATE existArticle SET is_published = 1 WHERE article_id = ?", [articleId], function (err) {
    if (err) {
      next(err); // Send the error on to the error handler
    } else {
      // Respond with a success status (HTTP 204 - No Content) after the update.
      res.sendStatus(204);
    }
  });
});




router.get("/settings", (req, res, next) => {
  // Query the database to fetch the specific edit based on the editId
  global.db.get("SELECT * FROM userSetting ", (err, setting) => {
    if (err) {
      next(err);
    } else if (!setting) {
      res.status(404).send('Setting not found.');
    } else {
      res.render('settings', { setting });
    }
  });
  console.log('setting page is working');
});


router.post("/submit-setting", (req, res, next) => {
  //The editId variable stores the article ID that is extracted from the URL parameter ":id".
  const {
    setting_title,
    setting_subtitle,
    setting_author_name
  } = req.body;

  //update the database with the edited data
  global.db.run(
    "UPDATE userSetting SET setting_title = ?, setting_subtitle = ?, setting_author_name = ?",
    [setting_title, setting_subtitle, setting_author_name],
    function (err) {
      if (err) {
        next(err); // Send the error on to the error handler
      } else {
        // fetch the updated data from the database
        global.db.get("SELECT * FROM userSetting", (err, updatedSetting) => {
          if (err) {
            next(err);
          } else {
            // Render the home page with the updated setting
            res.redirect('/author/home'); // Note: Pass the setting as an array to match the forEach loop in home.ejs
            // res.redirect("/author/home"); // Redirect the user back to the "/home" page after the update
          }
        });
      }
    }
  );
  console.log("setting update is working");
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
