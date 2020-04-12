"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class LocationMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async getByCode(awid, code) {
    let filter = {
      awid: awid,
      code: code
    };
    return await super.findOne(filter);
  }
  async increaseBookCount(awid, code, countOfBooks) {
    let filter = {
      awid: awid,
      code: code
    };
    return await super.findOneAndUpdate(filter, { countOfBooks }, "NONE");
  }
  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id
    };
    return await super.deleteOne(filter);
  }
}

module.exports = LocationMongo;
