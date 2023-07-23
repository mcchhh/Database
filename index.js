const express = require('express');

const app = express();
const port = 3000;
// USING THE NODE SQLITE3 CLIENT
const sqlite3 = require('sqlite3').verbose();
const { format } = require('date-fns');


//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db',function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));


// app.use(express.urlencoded()); //Parse URL-encoded bodies

// ADD SQL QUERIES BELOW:
// GETTING DATA OUT OF THE DATABASE AND READING IT INTO NODE.JS SO THAT THE OUTPUT CAN BE SHOWN IN HTML 
// CONNECTING THE DATABASE TO NODE 
// (command .get only retrieve the first row of the database)
// db.get("SELECT * FROM testUserRecords", function(err,data){
  
//   if(err){
//     console.error(err);
//     process.exit(1);
//   }else{
//     console.log(data);
//   }
// })

//ANOTHER COMMAND rather than just retrieving the first row of the database
// db.all(" SELECT * FROM testUserRecords WHERE test_record_value=? ", ["HELLO"])  // small way for a wild card 
// db.all("SELECT * FROM testUserRecords WHERE test_record_value='HELLO' "
db.all(" SELECT * FROM existArticle", function(err,data){
  
  if(err){
    console.error(err);
    process.exit(1);
  }else{
    console.log(data);
  }
})

db.all(" SELECT * FROM userSetting", function(err,data){
  
  if(err){
    console.error(err);
    process.exit(1);
  }else{
    console.log(data);
  }
})


// PUTTING IN THE DATA INTO THE DATABASE? 
// db.run("INSERT INTO testUsers VALUES (2, 'william')", function(err){

//   if(err){
//     console.error(err);
//     process.exit(1);
//   }
// })

// db.run("INSERT INTO testUserRecords (test_record_value, test_user_id) VALUES ('michelle', 2)", function(err) {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
// });

const authorHome = require('./routes/author');
const readerRouter = require('./routes/reader');



//this adds all the userRoutes to the app under the path /user
// ROUTER AND THE PATH TO BE USED ARE BELOW 
app.use('/author', authorHome);
app.use('/reader', readerRouter);

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Serve static files from the 'css' folder
app.use(express.static('css'));

app.get('/author', (req, res) => {
  res.send('Hello World!')
});
app.get('/reader', (req, res) => {
  res.send('Hello World! this is the reader route and it is working well')
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})










