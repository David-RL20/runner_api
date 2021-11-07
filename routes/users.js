const express = require("express");
const UsersService = require("../services/users");

function UsersApi(app) {
  const router = express.Router();
  const usersService = new UsersService();

  app.use("/api/users/", router);

  //GET all users
  router.get("/", async (req, res, next) => {
    try {
      const users = await usersService.getUsers();
      const answer = {
        users: users,
        message: "users Listed",
      };
      //Response
      res.status(200).json(answer);
    } catch (error) {
      next(error);
    }
  });

  //GET one user and validates wheter it exist or not
  router.get("/:userID", async (req, res, next) => {
    try {
      const { userID } = req.params;
      if (!userID) {
        res.status(400).json({
          status: 1,
          message: "missing parameter expected userID",
        });
      }
      const user = await usersService.getUser({ userID });
      if (user) {
        res.status(200).json({
          status: 0,
          user,
        });
      } else {
        res.status(404).json({
          status: 2,
          message: "Could not found user id in database",
        });
      }
    } catch (error) {
      next(error);
    }
  });

  //POST
  router.post("/signup", async (req, res, next) => {
    try {
      const { body: user } = req;
      const id_user = await usersService.createUser(user);
      res.status(201).json({
        status: 0,
        msg: "user added succesfully",
        id_user,
      });
    } catch (error) {
      next(error);
    }
  });

  //POST
  router.post("/signin", async (req, res, next) => {
    try {
      const { body } = req;
      const { email, password } = body;
      console.log(email, password);
      if (!email || !password) {
        res.status(400).json({
          status: 1,
          msg: "missing parameters",
        });
      }
      const user = await usersService.validateUser({ email, password });
      if (!user) {
        res.status(404).json({
          status: 30,
          msg: "email pr password invalid",
        });
      }
      res.status(201).json({
        status: 0,
        msg: "Login succesfully",
        token: "somerandomtoken",
        user,
      });
    } catch (error) {
      next(error);
    }
  });

  // //PUT
  // router.put("/:userID", async (req, res, next) => {
  //   try {
  //     const { userID } = req.params;
  //     const { body: user } = req;
  //     const updateUserID = await usersService.updateUser({
  //       userID,
  //       user,
  //     });

  //     //Anwer
  //     res.status(200).json({
  //       updateUserID,
  //       message: "user updated",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // });
}

module.exports = UsersApi;
