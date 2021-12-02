const express = require("express");
const moment = require("moment-timezone");
const geolib = require("geolib");
const { StatsService, TokensService, UsersService } = require("../services");

function StatsApi(app) {
  const router = express.Router();
  const statsService = new StatsService();
  const tokensService = new TokensService();
  const usersService = new UsersService();
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
          user_id: stats.user_id,
          stats: stats.stats,
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

      if (stats) {
        let current_week = moment.tz("America/Los_Angeles").format("w");

        const filter_stats = stats.stats.filter((ele) => {
          let ele_week = moment(ele.time).format("w");
          if (ele_week == current_week) {
            return ele;
          }
        });
        res.status(200).json({
          status: "0",
          stats: filter_stats,
        });
      } else {
        res.status(404).json({
          status: "4",
          msg: `user ${params.userID} doesn't have stats registered`,
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
  //user_id as header
  //Received token as header
  router.post("/", async (req, res, next) => {
    try {
      if (!req.body) {
        res.status(500).json({
          status: "10",
          msg: "This enpoint should received a body msg",
        });
      }

      if (!req.headers.user_id) {
        res.status(404).json({
          status: "1",
          msg: "Missing Parameters (user_id)",
        });
      }
      const query_params = {
        userID: req.headers.user_id,
      };
      //get user stats
      let stats = await statsService.getStats(query_params);

      if (stats) {
        stats.stats.push(req.body);
        const update_params = {
          _id: stats._id.toString(),
          stats: {
            ...stats,
          },
        };
        //remove _id to avoid errors
        delete stats._id;
        const a = await statsService.updateStats(update_params);
        res.status(200).json({
          status: "0",
          msg: "Stat added succesfully",
        });
      } else {
        let new_stat = {
          user_id: req.headers.user_id,
          stats: [req.body],
        };
        const res_mongo = await statsService.createStats(new_stat);
        if (res_mongo) {
          res.status(200).json({
            status: "0",
            msg: "New stat added succesfully",
          });
        } else {
          res.status(500).json({
            status: "5",
            msg: "Internal Server Error",
          });
        }
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });

  //Register the start of a run
  //user_id as header
  //Received token as header
  router.post("/start", async (req, res, next) => {
    try {
      if (!req.body) {
        res.status(500).json({
          status: "10",
          msg: "This enpoint should received a body msg",
        });
      }
      if (!req.body.latitude || !req.body.longitude) {
        res.status(500).json({
          status: "10",
          msg: "Missing parameters (latitude and longitude)",
        });
      }

      if (!req.headers.user_id) {
        res.status(404).json({
          status: "1",
          msg: "Missing Parameters (user_id)",
        });
      }
      const query_params = {
        firebase_id: req.headers.user_id,
      };
      const query_stats = {
        userID: req.headers.user_id,
      };

      //get user
      const user = await usersService.getUser(query_params);

      if (!user) {
        res.status(500).json({
          status: "10",
          msg: "User does not exist",
        });
      }
      //get user stats
      let stats = await statsService.getStats(query_stats);

      if (stats) {
        stats.stats.push({
          session: stats.stats.length + 1,
          time: moment.now(),
          distance: null,
          speed: null,
          route: {
            start: {
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              time: moment.now(),
            },
            end: {
              latitude: null,
              longitude: null,
            },
          },
          register_date: user.register_date,
          running_avg_session: null,
          time_running_avg_session: null,
          share: true,
        });
        const update_params = {
          _id: stats._id.toString(),
          firebase_id: stats.firebase_id,
          stats: {
            ...stats,
          },
        };
        //remove _id to avoid errors
        delete stats._id;
        const a = await statsService.updateStats(update_params);
        res.status(200).json({
          status: "0",
          msg: "Stat added succesfully",
        });
      } else {
        //adding first stat to user
        let new_stat = {
          firebase_id: req.headers.user_id,
          stats: [
            {
              session: 1,
              time: moment.now(),
              distance: null,
              speed: null,
              route: {
                start: {
                  latitude: req.body.latitude,
                  longitude: req.body.longitude,
                  time: moment.now(),
                },
                end: {
                  latitude: null,
                  longitude: null,
                },
              },
              register_date: user.register_date,
              running_avg_session: null,
              time_running_avg_session: null,
              share: true,
            },
          ],
        };
        const res_mongo = await statsService.createStats(new_stat);
        if (res_mongo) {
          res.status(200).json({
            status: "0",
            msg: "New stat added succesfully",
          });
        } else {
          res.status(500).json({
            status: "5",
            msg: "Internal Server Error",
          });
        }
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });
  //Register the start of a run
  //user_id as header
  //Received token as header
  router.post("/end", async (req, res, next) => {
    try {
      if (!req.body) {
        res.status(500).json({
          status: "10",
          msg: "This enpoint should received a body msg",
        });
      }
      if (!req.body.latitude || !req.body.longitude) {
        res.status(500).json({
          status: "10",
          msg: "Missing parameters (latitude and longitude)",
        });
      }

      if (!req.headers.user_id) {
        res.status(404).json({
          status: "1",
          msg: "Missing Parameters (user_id)",
        });
      }
      const query_params = {
        userID: req.headers.user_id,
      };
      //get user stats
      let stats = await statsService.getStats(query_params);

      if (stats) {
        let updated_stat = stats.stats[stats.stats.length - 1];
        if (updated_stat.route.end.latitude) {
          res.status(500).json({
            status: "502",
            msg: "This record already has latitude registered",
          });
        }
        const distance = geolib.getDistance(
          {
            latitude: updated_stat.route.start.latitude,
            longitude: updated_stat.route.start.longitude,
          },
          { latitude: req.body.latitude, longitude: req.body.longitude }
        );
        const speed = geolib.getSpeed(
          {
            latitude: updated_stat.route.start.latitude,
            longitude: updated_stat.route.start.longitude,
            time: updated_stat.route.start.time,
          },
          {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            time: moment.now(),
          }
        );
        updated_stat.speed = geolib.convertSpeed(speed, "kmh");
        updated_stat.distance = geolib.convertDistance(distance, "km");
        updated_stat.route.end = {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          time: moment.now(),
        };
        stats.stats.pop();
        stats.stats.push(updated_stat);
        const update_params = {
          _id: stats._id.toString(),
          stats: {
            ...stats,
          },
        };
        //remove _id to avoid errors
        delete stats._id;
        await statsService.updateStats(update_params);
        res.status(200).json({
          status: "0",
          msg: "Stat added succesfully",
        });
      } else {
        res.status(500).json({
          status: "502",
          msg: "Record not found to update",
        });
      }
    } catch (error) {
      res.status(404).json({
        status: "5",
        msg: error.toString(),
      });
    }
  });
}

module.exports = StatsApi;
