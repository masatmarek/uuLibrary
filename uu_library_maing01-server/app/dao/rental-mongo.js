"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class RentalMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async listByCriteria(awid, criteria, pageInfo = {}) {
    let filter = {};
    if (criteria.author) filter.author = criteria.author;
    if (criteria.locationCode) filter.locationCode = criteria.locationCode;
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

  async updateByCode(uuObject) {
    let filter = {
      awid: uuObject.awid,
      code: uuObject.code
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async deleteByCode(awid, code) {
    let filter = {
      awid,
      code
    };
    return await super.deleteOne(filter);
  }
}

module.exports = RentalMongo;
