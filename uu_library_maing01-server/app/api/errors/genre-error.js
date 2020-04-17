"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const GENRE_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}genre/`;

const Create = {
  UC_CODE: `${GENRE_ERROR_PREFIX}genre/create/`,
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
      this.message = "Code of genre must be unique.";
    }
  },
  CreateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createByDaoFailed`;
      this.message = "Create of genre failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${GENRE_ERROR_PREFIX}genre/delete/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  GenreDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}genreDoesNotExist`;
      this.message = "Genre does not exist.";
    }
  },
  DeleteByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteByDaoFailed`;
      this.message = "Delete by dao failed.";
    }
  }
};

const List = {
  UC_CODE: `${GENRE_ERROR_PREFIX}genre/list/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const Get = {
  UC_CODE: `${GENRE_ERROR_PREFIX}genre/get/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  Get,
  List,
  Delete,
  Create
};
