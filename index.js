const express = require("express");
const { config } = require("./config/");
const { UsersApi, StatsApi } = require("./routes");
const app = express();

//It can understand json
app.use(express.json());

UsersApi(app);
StatsApi(app);

app.listen(config.port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening http://localhost:${config.port}`);
});
