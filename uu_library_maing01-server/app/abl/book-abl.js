"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/book-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  relocateUnsupportedKeys: {
    code: `${Errors.Relocate.UC_CODE}unsupportedKeys`
  }
};
const STATES = {
  available: "available",
  borrowed: "borrowed",
  active: "active"
};
class BookAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "book-types.js"));
    this.dao = DaoFactory.getDao("book");
    this.locationDao = DaoFactory.getDao("location");
  }

  async setState(awid, dtoIn) {}

  async return(awid, dtoIn) {}

  async relocate(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("bookRelocateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.relocateUnsupportedKeys.code,
      Errors.Relocate.InvalidDtoIn
    );
    // HDS 2
    let book = await this.dao.getByCode(awid, dtoIn.code);
    if (!book) {
      //A3
      throw new Errors.Relocate.BookDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    if (book.state !== STATES.available) {
      //A4
      throw new Errors.Relocate.BookIsNotInProperState({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 3
    let location = await this.locationDao.getByCode(awid, dtoIn.code);
    if (!location) {
      //A5
      throw new Errors.Relocate.LocationDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    //todo: HDS 4 validate location capacity A6

    // HDS 5
    dtoIn.awid = awid;

    // HDS 6
    try {
      book = await this.dao.updateByCode(dtoIn);
    } catch (e) {
      // A7
      throw new Errors.Relocate.UpdateByDaoFailed({ uuAppErrorMap });
    }

    // HDS 7
    let dtoOut = { ...book };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async borrow(awid, dtoIn, session, profiles) {
    console.log(profiles);

    return session;
  }

  async list(awid, dtoIn) {
    //HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("bookListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2
    //todo: if dtoIn contains locationCode then check if location exists

    // HDS 3
    let dtoOut = await this.dao.listByCriteria(awid, dtoIn, dtoIn.pageInfo);

    // HDS 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("bookUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );
    // HDS 2
    let book = await this.dao.getByCode(awid, dtoIn.code);
    if (!book) {
      // A3
      throw new Errors.Update.BookDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 3
    dtoIn.awid = awid;

    // HDS 4
    try {
      book = await this.dao.updateByCode(dtoIn);
    } catch (e) {
      // A4
      throw new Errors.Update.UpdateByDaoFailed({ uuAppErrorMap });
    }

    // HDS 5
    let dtoOut = { ...book };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async create(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("bookCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2
    // HDS 2.1
    let location = await this.locationDao.getByCode(awid, dtoIn.locationCode);
    if (!location) {
      // A3
      throw new Errors.Create.LocationDoesNotExist({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
    }
    // HDS 2.2
    let books = await this.dao.listByCriteria(awid, { locationCode: location.code });
    if (books.itemList.length === location.capacity) {
      // A4
      throw new Errors.Create.LocationIsFull({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
    }
    // HDS 2.3
    if (location.state !== STATES.active) {
      //A5
      throw new Errors.Create.LocationIsNotInProperState(
        { uuAppErrorMap },
        { state: location.state, expectedState: STATES.active }
      );
    }
    // HDS 3
    dtoIn.awid = awid;
    dtoIn.state = STATES.available;

    // HDS 4
    let book;
    try {
      book = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A6
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      } else {
        // A7
        throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap });
      }
    }

    // HDS 5
    let dtoOut = { ...book };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new BookAbl();
