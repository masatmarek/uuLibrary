"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const LOCATION_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}location/`;

const Delete = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}delete/`
};

const Create = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DuplicateCode: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}duplicateCode`;
      this.message = "Code of book must be unique.";
    }
  },
  CreateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createByDaoFailed`;
      this.message = "Create of book failed.";
    }
  }
};

module.exports = {
  Create,
  Delete
};
