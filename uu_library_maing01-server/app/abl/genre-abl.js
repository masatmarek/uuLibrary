"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/genre-error.js");

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

class GenreAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "genre-types.js"));
    this.dao = DaoFactory.getDao("genre");
    this.libraryDao = DaoFactory.getDao("libraryMain");
    this.dao.createSchema();
  }

  async genreGet(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("genreGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS 2
    let genre = await this.dao.getByCode(awid, dtoIn.code);

    // HDS 3
    let dtoOut = { ...genre };
    dtoIn.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async genreList(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("genreListDtoInType", dtoIn);
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

  async genreDelete(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("genreDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2
    // HDS 2.1
    let genre = await this.dao.getByCode(awid, dtoIn.code);
    if (!genre) {
      // A3
      throw new Errors.Delete.GenreDoesNotExist({ uuAppErrorMap }, { code: dtoIn.code });
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

  async genreCreate(awid, dtoIn) {
    // HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("genreCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2
    let library = await this.libraryDao.getByAwid(awid);
    library.genres.forEach(genre => {
      if (genre.code === dtoIn.code) {
        // A3
        throw new Errors.Create.DuplicateCode({ uuAppErrorMap }, { code: dtoIn.code });
      }
    });
    library.genres.push(dtoIn);
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
}

module.exports = new GenreAbl();
