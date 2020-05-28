"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const Errors = require("../api/errors/library-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  },
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  }
};
const STATES = {
  active: "active"
};
class LibraryMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("libraryMain");
  }

  async libraryGet(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("getDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS 2
    let dtoOut = await this.dao.getByAwid(awid);

    // HDS 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async libraryCreate(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("createDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2
    dtoIn.awid = awid;
    dtoIn.state = STATES.active;
    // HDS 3
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (error) {
      // A3
      throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap }, { cause: error });
    }

    // HDS 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async init(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["libraryMain"];
    let schemaCreateResults = schemas.map(async schema => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3
    try {
      await SysProfileModel.setProfile(awid, { code: "Authorities", roleUri: dtoIn.authoritiesUri });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A4
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.authoritiesUri }, e);
      }
      throw e;
    }

    // HDS 4 - HDS N
    // TODO Implement according to application needs...

    // HDS N+1
    return {
      uuAppErrorMap: uuAppErrorMap
    };
  }
}

module.exports = new LibraryMainAbl();
