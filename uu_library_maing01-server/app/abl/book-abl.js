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
  }
};

class BookAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "book-types.js"));
    this.dao = DaoFactory.getDao("book");
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
    //todo: if dtoIn contains location then check if location exists

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
    dtoIn.awid = awid;

    // HDS 3
    //todo: check if location exists

    // HDS 4
    let book;
    try {
      book = await this.dao.updateByCode(dtoIn);
    } catch (e) {
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
    dtoIn.awid = awid;

    // HDS 3
    //todo: check if location exists

    // HDS 4
    let book;
    try {
      book = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap });
      } else {
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
