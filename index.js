const express = require("express");
const { config } = require("./config/");
// const books = require("./routes/books");
// const authors = require("./routes/authors");
const users = require("./routes/users");
const app = express();

//It can undestand json
app.use(express.json());

//Genres
users(app);
// //Authors
// authors(app);
// //Books
// books(app);

app.listen(config.port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening http://localhost:${config.port}`);
});
