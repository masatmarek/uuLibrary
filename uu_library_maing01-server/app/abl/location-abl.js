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
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  }
};

class LocationAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("location");
    this.bookDao = DaoFactory.getDao("book");
    this.libraryDao = DaoFactory.getDao("libraryMain");
  }

  async update(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("locationUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );
    //HDS 2
    let library = await this.libraryDao.getByAwid(awid);
    // HDS 2.1
    if (!library) {
      // A3
      throw new Errors.Update.LibraryDoesNotExist({ uuAppErrorMap }, { awid });
    }
    // HDS 2.2
    if (library.state !== Cfg.library.states.active) {
      // A4
      throw new Errors.Update.LibraryIsNotInProperState(
        { uuAppErrorMap },
        { state: library.state, expectedState: Cfg.library.states.active }
      );
    }
    // HDS 3
    let location = await this.dao.getByCode(awid, dtoIn.code);
    if (!location) {
      // A5
      throw new Errors.Update.LocationDoesNotExist({ uuAppErrorMap }, { location: dtoIn.code });
    }
    if (location.state === Cfg.location.states.closed) {
      // A6
      throw new Errors.Update.LocationIsNotInProperState(
        { uuAppErrorMap },
        {
          location: dtoIn.code,
          state: location.state,
          expectedStates: [Cfg.location.states.active, Cfg.location.states.suspend]
        }
      );
    }
    // HDS 4
    dtoIn.awid = awid;

    //HDS 5
    let dtoOut;
    try {
      dtoOut = await this.dao.updateByCode(dtoIn);
    } catch (error) {
      throw new Errors.Update.LocationUpdateFailed({ uuAppErrorMap }, { cause: error });
    }

    // HDS 6
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
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
    dtoIn.code = this.createCode(dtoIn.name);

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

    //HDS 4
    let dtoOut = { ...location };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async getProfiles(profiles) {
    return profiles._identityProfiles;
  }
  async delete(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("locationDeleteDtoInType", dtoIn);
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

module.exports = new LocationAbl();
