"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const BOOK_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}book/`;

const Create = {
  UC_CODE: `${BOOK_ERROR_PREFIX}create/`,

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
      this.message = "Create of book failed";
    }
  }
};

const Update = {
  UC_CODE: `${BOOK_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UpdateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}updateByDaoFailed`;
      this.message = "Update of book failed";
    }
  }
};

const List = {
  UC_CODE: `${BOOK_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  List,
  Update,
  Create
};
