const express = require("express");
const { StatsService, TokensService } = require("../services");

function StatsApi(app) {
  const router = express.Router();
  const statsService = new StatsService();
  const tokensService = new TokensService();
  app.use("/api/stats/", router);

  //Get the list of all the stats from a user
  //Received token as header
  //Received userID as header
  router.get("/", async (req, res, next) => {});

  //Get all the contacts stats from a user
  //Received token as header
  //Received userID as header
  router.get("/contacts", async (req, res, next) => {});

  //Get a list of all the weekly stats from users in a range location
  //Received token as header
  router.get("/weekly", async (req, res, next) => {});

  //Get a list of all the user with the best stats in a range location
  //Received token as header
  router.get("/best", async (req, res, next) => {});

  //Upload the new stats from a user
  //Received token as header
  router.post("/", async (req, res, next) => {});
}

module.exports = StatsApi;
