"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const CONDITION_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}condition/`;

const List = {
  UC_CODE: `${CONDITION_ERROR_PREFIX}condition/list/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const Create = {
  UC_CODE: `${CONDITION_ERROR_PREFIX}condition/create/`,

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
      this.message = "Code of condition must be unique.";
    }
  },
  CreateByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createByDaoFailed`;
      this.message = "Create of condition failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${CONDITION_ERROR_PREFIX}condition/celete/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ConditionDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}conditionDoesNotExist`;
      this.message = "Condition does not exist.";
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

const Get = {
  UC_CODE: `${CONDITION_ERROR_PREFIX}condition/get/`,
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
  Delete,
  Create,
  List
};
