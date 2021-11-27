const express = require("express");
const moment = require("moment-timezone");
const { StatsService, TokensService } = require("../services");

function StatsApi(app) {
  const router = express.Router();
  const statsService = new StatsService();
  const tokensService = new TokensService();
  app.use("/api/stats/", router);

  //Get the list of all the stats from a user
  //Received token as header
  //Received userID as header
  router.get("/", async (req, res, next) => {
    try {
      if (!req.headers.user_id) {
        res.status(404).json({
          status: "1",
          msg: "Missing Parameters (user_id)",
        });
      }
      const params = {
        userID: req.headers.user_id,
      };
      const stats = await statsService.getStats(params);

      if (stats) {
        res.status(200).json({
          status: "0",
          user_id: data.user_id,
          stats: data.stats,
        });
      } else {
        res.status(404).json({
          status: "4",
          msg: "record not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });

  //Get all the contacts stats from a user
  //Received token as header
  //Received userID as header
  router.get("/contacts", async (req, res, next) => {});

  //Get a list of all the weekly stats from users
  //Received token as header
  //Received userID as header
  router.get("/weekly", async (req, res, next) => {
    try {
      if (!req.headers.user_id) {
        res.status(404).json({
          status: "1",
          msg: "Missing Parameters (user_id)",
        });
      }
      const params = {
        userID: req.headers.user_id,
      };
      const stats = await statsService.getStats(params);
      let current_week = moment.tz("America/Los_Angeles").format("w");

      const filter_stats = stats.stats.filter((ele) => {
        let ele_week = moment(ele.time).format("w");
        if (ele_week == current_week) {
          return ele;
        }
      });

      if (stats) {
        res.status(200).json({
          status: "0",
          stats: filter_stats,
        });
      } else {
        res.status(404).json({
          status: "4",
          msg: "record not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });

  //Get a list of all the user with the best stats
  //Received token as header
  router.get("/best", async (req, res, next) => {
    try {
      const stats = await statsService.getAllStats();
      let all_stats = [];
      stats.forEach((element) => {
        element.stats.forEach((e) => {
          all_stats.push(e);
        });
      });
      let response = all_stats.sort((a, b) => b.distance - a.distance);

      if (stats) {
        res.status(200).json({
          status: "0",
          stats: response,
        });
      } else {
        res.status(404).json({
          status: "4",
          msg: "record not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });

  //Upload the new stats from a user
  //Received token as header
  router.post("/", async (req, res, next) => {});
}

module.exports = StatsApi;
