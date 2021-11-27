const MongoLib = require("../lib/mongo");

class StatsService {
  constructor() {
    this.collection = "stats";
    this.mongoDB = new MongoLib();
  }
  // async getUsers() {
  //   const users = await this.mongoDB.getAll(this.collection);
  //   return users;
  // }
  async getAllStats() {
    const stats = await this.mongoDB.getAll(this.collection);
    return stats;
  }
  async getStats({ userID }) {
    const stats = await this.mongoDB.getStatsByUserId(this.collection, userID);
    return stats;
  }
  async getStatsByWeek({ userID }) {
    const user = await this.mongoDB.get(this.collection, userID);
    return user;
  }
  async getStatsByBest() {
    const user = await this.mongoDB.get(this.collection, userID);
    return user;
  }
  async updateStats({ _id, stats }) {
    const updatedUserId = await this.mongoDB.update(
      this.collection,
      _id,
      stats
    );

    return updatedUserId;
  }
  async createStats(stats) {
    const createdUserId = await this.mongoDB.create(this.collection, stats);
    return createdUserId;
  }
}

module.exports = StatsService;
