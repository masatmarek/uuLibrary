"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const AUTHOR_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}author/`;

const Create = {
  UC_CODE: `${AUTHOR_ERROR_PREFIX}create/`,
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
      this.message = "Code of author must be unique.";
    }
  },
  CreateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createByDaoFailed`;
      this.message = "Create of author failed.";
    }
  },

  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryDoesNotExist`;
      this.message = "Library does not exist.";
    }
  },

  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryIsNotInProperState`;
      this.message = "Library is not in proper state.";
    }
  }
};

const List = {
  UC_CODE: `${AUTHOR_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  List,
  Create
};
