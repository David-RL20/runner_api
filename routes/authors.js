const express = require("express");
const AuthorService = require("../services/authors");

function AuthorsApi(app) {
  const router = express.Router();
  const authorService = new AuthorService();

  app.use("/api/authors/", router);

  //GET
  router.get("/", async (req, res, next) => {
    try {
      const authors = await authorService.getAuthors();
      const answer = {
        authors: authors,
        message: "authors Listed",
      };
      //Response
      res.status(200).json(answer);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:authorId", async (req, res, next) => {
    try {
      const { authorId } = req.params;
      const author = await authorService.getAuthor({ authorId });
      const answer = {
        author: author,
        message: "authors Listed",
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
      const { body: author } = req;
      const idauthorAdded = await authorService.createAuthor(author);
      res.status(201).json({
        idauthor: idauthorAdded,
        message: "author added",
      });
    } catch (error) {
      next(error);
    }
  });
  //PUT
  router.put("/:authorId", async (req, res, next) => {
    try {
      const { authorId } = req.params;
      const { body: author } = req;
      const updatedauthorId = await authorService.updateAuthor({
        authorId,
        author,
      });

      //Anwer
      res.status(200).json({
        updatedauthorId,
        message: "author updated",
      });
    } catch (error) {
      next(error);
    }
  });

  //DELETE
  router.delete("/:authorId", async (req, res, next) => {
    try {
      const { authorId } = req.params;
      const deleteAuthorId = await authorService.deleteAuthor({ authorId });

      //Answer
      res.status(200).json({
        deletedauthorId: deleteAuthorId,
        message: "author deleted",
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = AuthorsApi;
