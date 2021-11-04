const express = require("express");
const UsersService = require("../services/users");

function GenresApi(app) {
  const router = express.Router();
  const usersService = new UsersService();

  app.use("/api/users/", router);

  //GET
  router.get("/", async (req, res, next) => {
    try {
      const users = await usersService.getGenres();
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

  router.get("/:genreId", async (req, res, next) => {
    try {
      const { genreId } = req.params;
      const genre = await usersService.getGenre({ genreId });
      const answer = {
        genre: genre,
        message: "genres Listed",
      };
      //Response
      res.status(200).json(answer);
    } catch (error) {
      next(error);
    }
  });

  //POST
  router.post("/", async (req, res, next) => {
    try {
      const { body: genre } = req;
      const idGenreAdded = await usersService.createGenre(genre);
      res.status(201).json({
        idgenre: idGenreAdded,
        message: "Genre added",
      });
    } catch (error) {
      next(error);
    }
  });

  //PUT
  router.put("/:genreId", async (req, res, next) => {
    try {
      const { genreId } = req.params;
      const { body: genre } = req;
      const updatedGenreId = await usersService.updateGenre({
        genreId,
        genre,
      });

      //Anwer
      res.status(200).json({
        updatedGenreId,
        message: "genre updated",
      });
    } catch (error) {
      next(error);
    }
  });

  //DELETE
  router.delete("/:genreId", async (req, res, next) => {
    try {
      const { genreId } = req.params;
      const deleteGenreId = await usersService.deleteGenre({ genreId });

      //Answer
      res.status(200).json({
        deletedGenreId: deleteGenreId,
        message: "genre deleted",
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = GenresApi;
