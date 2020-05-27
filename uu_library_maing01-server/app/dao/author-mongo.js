"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class AuthorMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async list(awid) {
    let filter = {};
    filter.awid = awid;
    return await super.find(filter, {});
  }
}

module.exports = AuthorMongo;
