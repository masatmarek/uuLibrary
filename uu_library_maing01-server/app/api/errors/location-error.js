"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const LOCATION_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}location/`;

const Delete = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  },
  LocationContainBooks: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationContainBooks`;
      this.message =
        "Location contain books if you want to delete all books from this location set 'forceDelete': 'true'.";
    }
  },
  DeleteByCodeFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteByCodeFailed`;
      this.message = "Delete of location failed.";
    }
  }
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
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryIsNotInProperState`;
      this.message = "Library is not in proper state.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryDoesNotExist`;
      this.message = "Library does not exist.";
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

const List = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const SetState = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}setState/`
};

const Suspend = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}suspend/`
};

const Reactivate = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}reactivate/`
};

const Close = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}close/`
};

const Update = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  },
  LocationIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationIsNotInProperState`;
      this.message = "Locationis not in proper state.";
    }
  },
  LocationUpdateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationUpdateFailed`;
      this.message = "Locationis update by dao failed.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryIsNotInProperState`;
      this.message = "Library is not in proper state.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryDoesNotExist`;
      this.message = "Library does not exist.";
    }
  }
};

module.exports = {
  Update,
  Close,
  Reactivate,
  Suspend,
  SetState,
  List,
  Create,
  Delete
};
