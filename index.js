const express = require("express");
var cors = require("cors");
const { config } = require("./config/");
const { UsersApi, StatsApi } = require("./routes");
const app = express();

//It can understand json
app.use(express.json());
app.use(cors());
UsersApi(app);
StatsApi(app);

app.listen(config.port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening http://localhost:${config.port}`);
});
