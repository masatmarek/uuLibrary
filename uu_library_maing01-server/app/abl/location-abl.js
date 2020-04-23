"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Cfg = require("../helpers/config.js");
const Errors = require("../api/errors/location-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
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
    this.bookDao = DaoFactory.getDao("book");
    this.libraryDao = DaoFactory.getDao("libraryMain");
  }

  async close(awid, dtoIn) {}

  async reactivate(awid, dtoIn) {}

  async suspend(awid, dtoIn) {}

  async setState(awid, dtoIn) {}

  async list(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("locationListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
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
    dtoIn.state = Cfg.location.states.active;
    dtoIn.awid = awid;

    //HDS 4
    let location;
    try {
      location = await this.dao.create(dtoIn);
    } catch (error) {
      if (error instanceof DuplicateKey) {
        // A5
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      } else {
        // A6
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
    let validationResult = this.validator.validate("deleteDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    // HDS 2
    let location = await this.dao.getByCode(awid, dtoIn.code);
    if (!location) {
      // A3
      throw new Errors.Delete.LocationDoesNotExist({ uuAppErrorMap }, { location: dtoIn.code });
    }

    let books = await this.bookDao.listByCriteria(awid, { locationCode: location.code });

    //HDS 3
    let dtoOut = {};
    // HDS 3.1
    if (books.itemList.length !== 0 && !dtoIn.forceDelete) {
      // A4
      throw new Errors.Delete.LocationContainBooks({ uuAppErrorMap }, { location: dtoIn.code, books: books.itemList });
    } // HDS 3.2
    else if ((books.itemList.length !== 0 && dtoIn.forceDelete === true) || books.itemList.length === 0) {
      try {
        let removeDtoIn = { code: dtoIn.code, awid: awid };
        dtoOut = await this.dao.deleteByCode(removeDtoIn);
      } catch (error) {
        throw new Errors.Delete.DeleteByCodeFailed({ uuAppErrorMap }, { cause: error });
      }
      // HDS 3.3
      if (books.itemList.length !== 0) {
        try {
          await this.bookDao.deleteManyByLocation(awid, dtoIn.code);
        } catch (error) {
          throw new Errors.Delete.DeleteByCodeFailed({ uuAppErrorMap }, { cause: error });
        }
      }
    }
    // HDS 4
    return uuAppErrorMap;
  }
}

module.exports = new LocationAbl();
