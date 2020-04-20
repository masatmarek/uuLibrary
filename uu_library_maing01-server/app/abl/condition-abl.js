"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/condition-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  }
};

class ConditionAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "condition-types.js"));
    this.dao = DaoFactory.getDao("condition");
    this.libraryDao = DaoFactory.getDao("libraryMain");

    this.dao.createSchema();
  }

  async conditionGet(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("conditionGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS 2
    let condition = await this.dao.getByCode(awid, dtoIn.code);

    // HDS 3
    let dtoOut = { ...condition };
    dtoIn.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async conditionDelete(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("conditionDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2
    // HDS 2.1
    let condition = await this.dao.getByCode(awid, dtoIn.code);
    if (!condition) {
      // A3
      throw new Errors.Delete.ConditionDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
    }
    // HDS 3
    try {
      await this.dao.deleteByCode(awid, dtoIn.code);
    } catch (error) {
      // A4
      throw new Errors.Delete.DeleteByDaoFailed({ uuAppErrorMap }, { cause: error });
    }

    // HDS 3
    return uuAppErrorMap;
  }

  async conditionCreate(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("conditionCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2
    let library = await this.libraryDao.getByAwid(awid);
    library.conditions.forEach(condition => {
      if (condition.code === dtoIn.code) {
        // A3
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      }
    });
    library.conditions.push(dtoIn);
    // HDS 3
    try {
      library = await this.libraryDao.updateByAwid(library);
    } catch (e) {
      // A4
      throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap }, { cause: e });
    }

    //HDS 4
    let dtoOut = { ...library };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async conditionList(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("conditionListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // HDS 2
    let dtoOut = await this.dao.list(awid, dtoIn.pageInfo);

    // HDS 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ConditionAbl();
