"use strict";
const RentalAbl = require("../../abl/rental-abl.js");

class RentalController {
  confirmConfirmBorrowBook(ucEnv) {
    return RentalAbl.confirmConfirmBorrowBook(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new RentalController();
