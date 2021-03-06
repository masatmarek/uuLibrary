"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ConditionMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async list(awid, pageInfo = {}) {
    let filter = {};
    filter.awid = awid;
    return await super.find(filter, pageInfo);
  }
  async getByCode(awid, code) {
    let filter = {
      awid: awid,
      code: code
    };
    return await super.findOne(filter);
  }

  async deleteByCode(awid, code) {
    let filter = {
      awid,
      code
    };
    return await super.deleteOne(filter);
  }
}

module.exports = ConditionMongo;
