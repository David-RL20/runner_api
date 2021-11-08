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
  async getStats({ userID }) {
    const user = await this.mongoDB.getByUserId(this.collection, userID);
    return user;
  }
  async getStatsByWeek({ userID }) {
    const user = await this.mongoDB.get(this.collection, userID);
    return user;
  }
  async getStatsByBest() {
    const user = await this.mongoDB.get(this.collection, userID);
    return user;
  }
  async createStats(stats) {
    const createdUserId = await this.mongoDB.create(this.collection, stats);
    return createdUserId;
  }
}

module.exports = StatsService;
