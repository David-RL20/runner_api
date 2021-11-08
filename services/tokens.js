const MongoLib = require("../lib/mongo");
const momentTZ = require("moment-timezone");
class TokensService {
  constructor() {
    this.collection = "tokens";
    this.mongoDB = new MongoLib();
  }
  async getTokens() {
    const tokens = await this.mongoDB.getAll(this.collection);
    return tokens;
  }
  async getToken({ userID }) {
    const token = await this.mongoDB.getByUserId(this.collection, userID);
    return token;
  }
  async createToken(user_id) {
    const start_date = momentTZ().tz("America/Tijuana").toDate();
    const end_time = momentTZ(start_date).add(1, "days").toString();
    const token = {
      start_date,
      end_time,
      user_id,
    };
    //DELETE old token in case there is
    await this.mongoDB.deleteToken(this.collection, user_id);
    const createdTokenId = await this.mongoDB.create(this.collection, token);
    return createdTokenId;
  }
  async updateToken({ tokenID, token }) {
    const updatedTokenId = await this.mongoDB.update(
      this.collection,
      tokenID,
      token
    );

    return updatedTokenId;
  }

  async deleteToken({ tokenID }) {
    const deletedTokenID = await this.mongoDB.delete(this.collection, tokenID);
    return deletedTokenID;
  }
}

module.exports = TokensService;
