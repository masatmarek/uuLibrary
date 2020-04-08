"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class BookMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async listByCriteria(awid, criteria, pageInfo) {
    let filter = {};
    if (criteria.author) filter.author = criteria.author;
    if (criteria.locationCode) filter.locationCode = criteria.locationCode;
    filter.awid = awid;
    return await super.find(filter, pageInfo);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id
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

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id
    };
    return await super.deleteOne(filter);
  }
}

module.exports = BookMongo;
