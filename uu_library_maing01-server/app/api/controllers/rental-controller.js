"use strict";
const RentalAbl = require("../../abl/rental-abl.js");

class RentalController {
  confirmBorrowBook(ucEnv) {
    return RentalAbl.confirmBorrowBook(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  declineBorrowBook(ucEnv) {
    return RentalAbl.declineBorrowBook(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new RentalController();
