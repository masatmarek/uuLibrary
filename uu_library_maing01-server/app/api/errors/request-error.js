"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const REQUEST_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}request/`;

const Create = {
  UC_CODE: `${REQUEST_ERROR_PREFIX}request/create/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CreateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createByDaoFailed`;
      this.message = "Create of request failed.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  LocationIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsNotInProperState`;
      this.message = "Location is not in proper state.";
    }
  },
  BookIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}bookIsNotInProperState`;
      this.message = "Book is not in proper state";
    }
  }
};

module.exports = {
  Create
};
