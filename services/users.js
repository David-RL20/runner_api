const MongoLib = require("../lib/mongo");

class UsersService {
  constructor() {
    this.collection = "users";
    this.mongoDB = new MongoLib();
  }
  async getUsers() {
    const users = await this.mongoDB.getAll(this.collection);
    return users;
  }
  async getUser(query) {
    const user = await this.mongoDB.getByQuery(this.collection, query);
    return user;
  }
  async validateUser({ email, password }) {
    const user = await this.mongoDB.validate(this.collection, email, password);
    return user;
  }
  async createUser(user) {
    const createdUserId = await this.mongoDB.create(this.collection, user);
    return createdUserId;
  }
  async updateUser({ userID, user }) {
    const updatedUserId = await this.mongoDB.update(
      this.collection,
      userID,
      user
    );

    return updatedUserId;
  }

  async deleteUser({ userId }) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUserId;
  }
}

module.exports = UsersService;
