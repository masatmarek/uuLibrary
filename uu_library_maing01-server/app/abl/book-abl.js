"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/book-error.js");
const Cfg = require("../helpers/config.js");

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
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
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
    this.libraryDao = DaoFactory.getDao("libraryMain");
  }

  async delete(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("bookDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    // HDS 2
    let book = await this.dao.getByCode(awid, dtoIn.code);
    if (!book) {
      // A3
      throw new Errors.Delete.BookDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 3
    try {
      await this.dao.deleteByCode(awid, dtoIn.code);
    } catch (e) {
      // A4
      throw new Errors.Delete.DeleteByCodeFailed({ uuAppErrorMap }, { code: dtoIn.code }, e);
    }
    // HDS;
    return { uuAppErrorMap };
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
    // HDS 2.1
    let book = await this.dao.getByCode(awid, dtoIn.code);
    if (!book) {
      //A3
      throw new Errors.Relocate.BookDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 2.2
    if (book.state !== STATES.available) {
      //A4
      throw new Errors.Relocate.BookIsNotInProperState(
        { uuAppErrorMap },
        { state: book.state, expectedState: STATES.available }
      );
    }
    // HDS 3
    // HDS 3.1
    let location = await this.locationDao.getByCode(awid, dtoIn.locationCode);
    if (!location) {
      // A5
      throw new Errors.Relocate.LocationDoesNotExist({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
    }
    // HDS 3.2
    if (dtoIn.locationCode === book.locationCode) {
      // A6
      throw new Errors.Relocate.BookIsAlreadyInThisLocation({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
    }
    // HDS 3.3
    let books = await this.dao.listByCriteria(awid, { locationCode: location.code });
    if (books.itemList.length === location.capacity) {
      // A7
      throw new Errors.Relocate.LocationIsFull({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
    }
    // HDS 3.4
    if (location.state !== STATES.active) {
      //A8
      throw new Errors.Relocate.LocationIsNotInProperState(
        { uuAppErrorMap },
        { state: location.state, expectedState: STATES.active }
      );
    }
    // HDS 4
    dtoIn.awid = awid;

    // HDS 5
    try {
      book = await this.dao.updateByCode(dtoIn);
    } catch (e) {
      // A9
      throw new Errors.Relocate.UpdateByDaoFailed({ uuAppErrorMap });
    }

    // HDS 6
    let dtoOut = { ...book };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
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
    if (dtoIn && dtoIn.locationCode) {
      let location = await this.locationDao.getByCode(awid, dtoIn.locationCode);
      if (!location) {
        // A3
        throw new Errors.List.LocationDoesNotExist({ uuAppErrorMap }, { locationCode: dtoIn.locationCode });
      }
    }

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
    let library = await this.libraryDao.getByAwid(awid);
    // HDS 3.1
    if (!library) {
      // A6
      throw new Errors.Create.LibraryDoesNotExist({ uuAppErrorMap }, { awid });
    }
    if (library.state !== Cfg.library.states.active) {
      // A7
      throw new Errors.Create.LibraryIsNotInProperState(
        { uuAppErrorMap },
        { state: library.state, expectedState: Cfg.library.states.active }
      );
    }

    // HDS 3.2
    let { genres, conditions } = library;
    let libraryGenreCodes = [];
    genres.forEach(genre => {
      libraryGenreCodes.push(genre.code);
    });
    let genresValid = dtoIn.genreCodes.every(val => libraryGenreCodes.includes(val));
    if (!genresValid) {
      // A8
      throw new Errors.Create.GenreDoesNotExist({ uuAppErrorMap });
    }
    // HDS 3.3
    let libraryConditionCodes = [];
    conditions.forEach(condition => {
      libraryConditionCodes.push(condition.code);
    });
    let conditionsValid = libraryConditionCodes.includes(dtoIn.conditionCode);
    if (!conditionsValid) {
      // A9
      throw new Errors.Create.ConditionDoesNotExist({ uuAppErrorMap });
    }
    // HDS 4
    dtoIn.code = this.createCode(dtoIn.name);
    dtoIn.awid = awid;
    dtoIn.state = STATES.available;

    // HDS 5
    let book;
    try {
      book = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A10
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      } else {
        // A11
        throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap });
      }
    }

    // HDS 6
    let dtoOut = { ...book };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  createCode(name) {
    let code = "";
    for (let i = 0; i < name.length; i++) {
      const inSymbol = name[i];
      let outSymbol;
      switch (inSymbol.toLowerCase()) {
        case "á":
          outSymbol = "a";
          break;
        case "é":
          outSymbol = "e";
          break;
        case "ě":
          outSymbol = "e";
          break;
        case "í":
          outSymbol = "i";
          break;
        case "ú":
          outSymbol = "u";
          break;
        case "ů":
          outSymbol = "u";
          break;
        case "č":
          outSymbol = "c";
          break;
        case "ó":
          outSymbol = "o";
          break;
        case "š":
          outSymbol = "s";
          break;
        case "ť":
          outSymbol = "t";
          break;
        case "ř":
          outSymbol = "r";
          break;
        case "ž":
          outSymbol = "z";
          break;
        case "ý":
          outSymbol = "y";
          break;
        case "ň":
          outSymbol = "";
          break;
        case "ď":
          outSymbol = "d";
          break;
        case " ":
          outSymbol = "-";
          break;
        default:
          outSymbol = inSymbol;
          break;
      }
      code += outSymbol.toLowerCase();
    }
    return code;
  }
}

module.exports = new BookAbl();
