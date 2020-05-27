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
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
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
  },
  LocationIsFull: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsFull`;
      this.message = "Location is full.";
    }
  },
  LocationIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsNotInProperState`;
      this.message = "Location is not in proper state.";
    }
  },
  AuthorsDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}authorsDoesNotExist`;
      this.message = "One of author does not exists.";
    }
  },
  ConditionDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}conditionDoesNotExist`;
      this.message = "Condition does not exist.";
    }
  },
  GenreDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}genreDoesNotExist`;
      this.message = "One of entered genre does not exist.";
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
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
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
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  }
};

const Relocate = {
  UC_CODE: `${BOOK_ERROR_PREFIX}relocate/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Relocate.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Relocate.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Borrow.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  BookIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Borrow.UC_CODE}bookIsNotInProperState`;
      this.message = "Book is not in proper state";
    }
  },
  LocationIsFull: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsFull`;
      this.message = "Location is full.";
    }
  },
  LocationIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsNotInProperState`;
      this.message = "Location is not in proper state.";
    }
  },
  BookIsAlreadyInThisLocation: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}bookIsAlreadyInThisLocation`;
      this.message = "Book is already in this location.";
    }
  }
};

const Borrow = {
  UC_CODE: `${BOOK_ERROR_PREFIX}borrow/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Borrow.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Borrow.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  BookIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Borrow.UC_CODE}bookIsNotInProperState`;
      this.message = "Book is not in proper state";
    }
  }
};
const Return = {
  UC_CODE: `${BOOK_ERROR_PREFIX}return/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Return.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Return.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  BookIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Return.UC_CODE}bookIsNotInProperState`;
      this.message = "Book is not in proper state";
    }
  }
};

const SetState = {
  UC_CODE: `${BOOK_ERROR_PREFIX}setState/`,

  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const Delete = {
  UC_CODE: `${BOOK_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  DeleteByCodeFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteByCodeFailed`;
      this.message = "Delete of book failed.";
    }
  }
};

module.exports = {
  Delete,
  SetState,
  Return,
  Relocate,
  Borrow,
  List,
  Update,
  Create
};
