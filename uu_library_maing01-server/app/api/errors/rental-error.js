"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const RENTAL_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}rental/`;

const ConfirmBorrowBook = {
  UC_CODE: `${RENTAL_ERROR_PREFIX}ConfirmBorrowBook/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  RequestDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}requestDoesNotExist`;
      this.message = "Request does not exist.";
    }
  },
  IsNotBorrowRequest: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}isNotBorrowRequest`;
      this.message = "This is not borrow request.";
    }
  },
  UpdateBookByDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}updateBookByDaoFailed`;
      this.message = "Update book failed by dao.";
    }
  },
  CreateRentalFailedByDao: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}createRentalFailedByDao`;
      this.message = "Create rental failed by dao.";
    }
  },
  DeleteRequestFailedByDao: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ConfirmBorrowBook.UC_CODE}deleteRequestFailedByDao`;
      this.message = "Delete reques failed by dao.";
    }
  }
};

module.exports = {
  ConfirmBorrowBook
};
