const MongoLib = require("../lib/mongo");

class AuthorsService {
  constructor() {
    this.collection = "authors";
    this.mongoDB = new MongoLib();
  }
  async getAuthors() {
    const authors = await this.mongoDB.getAll(this.collection);
    return authors;
  }
  async getAuthor({ authorId }) {
    const author = await this.mongoDB.get(this.collection, authorId);
    return author;
  }
  async createAuthor(author) {
    const createdAuthorId = await this.mongoDB.create(this.collection, author);
    return createdAuthorId;
  }
  async updateAuthor({ authorId, author }) {
    const updatedAuthorId = await this.mongoDB.update(
      this.collection,
      authorId,
      author
    );
    return updatedAuthorId;
  }
  async deleteAuthor({ authorId }) {
    const deletedAuthorId = await this.mongoDB.delete(
      this.collection,
      authorId
    );
    return deletedAuthorId;
  }
}

module.exports = AuthorsService;
