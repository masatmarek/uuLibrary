"use strict";
const RentalAbl = require("../../abl/rental-abl.js");

class RentalController {
  borrowBook(ucEnv) {
    return RentalAbl.borrowBook(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new RentalController();
