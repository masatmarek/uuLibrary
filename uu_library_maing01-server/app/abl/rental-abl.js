"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/rental-error.js");

const WARNINGS = {
  borowBookUnsupportedKeys: {
    code: `${Errors.BorrowBook.UC_CODE}unsupportedKeys`
  }
};

const STATES = {
  available: "available",
  borrowed: "borrowed",
  active: "active"
};

class RentalAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "rental-types.js"));
    this.dao = DaoFactory.getDao("rental");
    this.bookDao = DaoFactory.getDao("book");
    this.locationDao = DaoFactory.getDao("location");
  }

  async borrowBook(awid, dtoIn, session) {
    //HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("rentalBorrowBookDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.borowBookUnsupportedKeys.code,
      Errors.BorrowBook.InvalidDtoIn
    );
    // HDS 2
    // HDS 2.1
    let book = await this.bookDao.getByCode(awid, dtoIn.code);
    if (!book) {
      // A3
      throw new Errors.BorrowBook.BookDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 2.2
    if (book.state !== STATES.available) {
      // A4
      throw new Errors.BorrowBook.BookIsNotInProperState(
        { uuAppErrorMap },
        { state: book.state, expectedState: STATES.available }
      );
    }
    // HDS 3
    // HDS 3.1
    let location = await this.locationDao.getByCode(awid, book.locationCode);
    if (location.state !== STATES.active) {
      // A5
      throw new Errors.BorrowBook.LocationIsNotInProperState(
        { uuAppErrorMap },
        { state: location.state, expectedState: STATES.active }
      );
    }
    // HDS 4
    dtoIn.awid = awid;
    dtoIn.state = STATES.borrowed;

    // HDS 5
    try {
      await this.bookDao.updateByCode(dtoIn);
    } catch (error) {
      // A6
      throw new Errors.BorrowBook.UpdateBookByDaoFailed({ uuAppErrorMap }, { cause: error });
    }
    // HDS 6
    // HDS 6.1
    let date = new Date();
    let rentalDtoIn = {
      awid: awid,
      code: `RENTAL-${dtoIn.code}`,
      from: this.formatDate(date),
      to: this.formatDate(date.setMonth(date.getMonth() + 1)),
      customer: {
        uuIdentity: session._identity._uuIdentity,
        name: session._identity._name,
        email: session._attributes.email
      }
    };
    // HDS 6.2
    let dtoOut = {};
    try {
      dtoOut = await this.dao.create(rentalDtoIn);
    } catch (error) {
      try {
        dtoIn.state = STATES.available;
        await this.bookDao.updateByCode(dtoIn);
      } catch (error) {
        throw new Errors.BorrowBook.UpdateBookByDaoFailed({ uuAppErrorMap }, { cause: error });
      }
      throw new Errors.BorrowBook.CreateRentalFailedByDao({ uuAppErrorMap }, { cause: error });
    }

    //HDS 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }
}

module.exports = new RentalAbl();
