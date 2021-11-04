const express = require('express');
const BooksService = require('../services/books');

function booksApi(app) {
   const router = express.Router();
   const booksService = new BooksService();

   app.use('/api/books/', router);

   //GET
   router.get('/', async (req, res, next) => {
      try {
         const { categories } = req.query;
         const books = await booksService.getBooks({ categories });
         const answer = {
            books: books,
            message: 'Books Listed',
         };
         //Response
         res.status(200).json(answer);
      } catch (error) {
         next(error);
      }
   });
   router.get('/:bookId', async (req, res, next) => {
      try {
         const { bookId } = req.params;
         const book = await booksService.getBook({ bookId });
         const answer = {
            book: book,
            message: 'Books Listed',
         };
         //Response
         res.status(200).json(answer);
      } catch (error) {
         next(error);
      }
   });

   //POST
   router.post('/', async (req, res, next) => {
      try {
         const { body: book } = req;
         const idBookAdded = await booksService.createBook(book);
         res.status(201).json({
            idBook: idBookAdded,
            message: 'Book added',
         });
      } catch (error) {
         next(error);
      }
   });
   //PUT
   router.put('/:bookId', async (req, res, next) => {
      try {
         const { bookId } = req.params;
         const { body: book } = req;
         const updatedBookId = await booksService.updateBook({ bookId, book });

         //Anwer
         res.status(200).json({
            updatedBookId,
            message: 'book updated',
         });
      } catch (error) {
         next(error);
      }
   });

   //DELETE
   router.delete('/:bookId', async (req, res, next) => {
      try {
         const { bookId } = req.params;
         const deleteBookId = await booksService.deleteBook({ bookId });

         //Answer
         res.status(200).json({
            deletedBookId: deleteBookId,
            message: 'book deleted',
         });
      } catch (error) {
         next(error);
      }
   });
}

module.exports = booksApi;
