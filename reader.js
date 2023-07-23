
const express = require("express");
const router = express.Router();
const assert = require('assert');
const { format } = require('date-fns');




router.get("/homepage", (req, res, next) => {
  // Fetch the userSetting data from the database
  global.db.get("SELECT * FROM userSetting", function (err, setting) {
    if (err) {
      next(err); // Send the error on to the error handler
    } else {
      // Now, fetch the published articles (where is_published is 1) from the database
      global.db.all("SELECT * FROM existArticle WHERE is_published = 1", function (err, rows) {
        if (err) {
          next(err); // Send the error on to the error handler
        } else {
          // Pass both userSetting and published articles to the homepage template
          res.render('homepage', { setting, articles: rows });
        }
      });
    }
  });
  console.log("homepage is working");
});





router.get("/reading-article/:id", (req, res, next) => {
  const readingId = req.params.id; // Retrieve the article ID from the URL parameter


  // Query the database to fetch the specific article based on the articleId
  global.db.get("SELECT * FROM existArticle WHERE article_id = ? AND is_published = 1", [readingId], (err, reading) => {
    if (err) {
      next(err);
    } else if (!reading) {
      res.status(404).send('Article not found or not published.'); // Handle the case when the article is not found or not published
    } else {
      reading.article_created = format(new Date(reading.article_created), 'dd MMMM yyyy');
      reading.article_last_modified = format(new Date(reading.article_last_modified), 'dd MMMM yyyy, hh:mm:ss a');

      res.render('reading-articles', { article : reading });
    }
      
    
  });
  console.log("Reading article is working");
});


module.exports = router;