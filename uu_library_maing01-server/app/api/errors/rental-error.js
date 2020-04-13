"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const RENTAL_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}rental/`;

const BorrowBook = {
  UC_CODE: `${RENTAL_ERROR_PREFIX}borrowBook/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  BookIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}bookIsNotInProperState`;
      this.message = "Book is not in proper state.";
    }
  },
  LocationIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}locationIsNotInProperState`;
      this.message = "Location is not in proper state.";
    }
  },
  UpdateBookByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}updateBookByDaoFailed`;
      this.message = "Update book failed by dao.";
    }
  },
  CreateRentalFailedByDao: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BorrowBook.UC_CODE}createRentalFailedByDao`;
      this.message = "Create rental failed by dao.";
    }
  }
};

module.exports = {
  BorrowBook
};
