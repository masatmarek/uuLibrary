"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/author-error.js");
const Cfg = require("../helpers/config.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};

class AuthorAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "author-types.js"));
    this.dao = DaoFactory.getDao("author");
    this.libraryDao = DaoFactory.getDao("libraryMain");
  }

  async authorList(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("authorListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    let authors = await this.dao.list(awid);
    let dtoOut = { ...authors };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async authorCreate(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("authorCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    //HDS 2
    let library = await this.libraryDao.getByAwid(awid);
    // HDS 2.1
    if (!library) {
      // A3
      throw new Errors.Create.LibraryDoesNotExist({ uuAppErrorMap }, { awid });
    }
    // HDS 2.2
    if (library.state !== Cfg.library.states.active) {
      // A4
      throw new Errors.Create.LibraryIsNotInProperState(
        { uuAppErrorMap },
        { state: library.state, expectedState: Cfg.library.states.active }
      );
    }

    //HDS 3
    dtoIn.awid = awid;
    dtoIn.code = this.createCode(dtoIn.name);

    //HDS 4
    let author;
    try {
      author = await this.dao.create(dtoIn);
    } catch (error) {
      if (error instanceof DuplicateKey) {
        // A5
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      } else {
        // A6
        throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap }, { cause: { ...error } });
      }
    }

    //HDS 4
    let dtoOut = { ...author };
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

module.exports = new AuthorAbl();
