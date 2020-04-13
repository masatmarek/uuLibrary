"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/location-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  }
};
const STATES = {
  active: "active",
  suspend: "suspend",
  closed: "closed"
};
class LocationAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("location");
  }

  async list(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("locationListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 3
    let dtoOut = await this.dao.list(awid, dtoIn.pageInfo);

    // HDS 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async create(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("locationCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    //HDS 2
    dtoIn.state = STATES.active;
    dtoIn.awid = awid;

    //HDS 3
    let location;
    try {
      location = await this.dao.create(dtoIn);
    } catch (error) {
      if (error instanceof DuplicateKey) {
        // A3
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      } else {
        // A4
        throw new Errors.Create.CreateByDaoFailed({ uuAppErrorMap }, { cause: { ...error } });
      }
    }

    //HDS4
    let dtoOut = { ...location };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async getProfiles(profiles) {
    return profiles._identityProfiles;
  }
  async delete(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    return {
      uuAppErrorMap: uuAppErrorMap
    };
  }
}

module.exports = new LocationAbl();
