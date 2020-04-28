"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/rental-error.js");
const nodemailer = require("nodemailer");

const WARNINGS = {
  confirmBorowBookUnsupportedKeys: {
    code: `${Errors.ConfirmBorrowBook.UC_CODE}unsupportedKeys`
  },
  declineBorowBookUnsupportedKeys: {
    code: `${Errors.DeclineBorrowBook.UC_CODE}unsupportedKeys`
  }
};

const STATES = {
  available: "available",
  borrowed: "borrowed",
  active: "active"
};

class RentalAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "rental-types.js"));
    this.dao = DaoFactory.getDao("rental");
    this.bookDao = DaoFactory.getDao("book");
    this.requestDao = DaoFactory.getDao("request");
  }

  async confirmBorrowBook(awid, dtoIn) {
    //HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("rentalConfirmBorrowBookDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.confirmBorowBookUnsupportedKeys.code,
      Errors.ConfirmBorrowBook.InvalidDtoIn
    );
    // HDS 2
    dtoIn.awid = awid;

    // HDS 3
    // HDS 3.1
    let request = await this.requestDao.getByCode(awid, dtoIn.requestCode);
    if (!request) {
      // A3
      throw new Errors.ConfirmBorrowBook.RequestDoesNotExist({ uuAppErrorMap }, { code: dtoIn.requestCode });
    }
    // HDS 3.2
    let requestType = request.code.split("-");
    if (requestType[0] !== "BORROW") {
      // A4
      throw new Errors.ConfirmBorrowBook.IsNotBorrowRequest(
        { uuAppErrorMap },
        { code: request.code, expectType: "borrow" }
      );
    }
    // HDS 4
    try {
      await this.bookDao.updateByCode({ awid, code: request.bookCode, state: STATES.borrowed });
    } catch (error) {
      // A3
      throw new Errors.ConfirmBorrowBook.UpdateBookByDaoFailed({ uuAppErrorMap }, { cause: error });
    }

    // HDS 5
    // HDS 5.1
    let rentalDtoIn = {
      awid: awid,
      code: `RENTAL-${request.bookCode}`,
      bookCode: request.bookCode,
      from: request.from,
      to: this.addOneMonth(request.from),
      customer: request.customer
    };
    // HDS 5.2
    let dtoOut = {};
    try {
      dtoOut = await this.dao.create(rentalDtoIn);
    } catch (error) {
      try {
        await this.bookDao.updateByCode({ awid, code: request.bookCode, state: STATES.available });
      } catch (error) {
        throw new Errors.ConfirmBorrowBook.UpdateBookByDaoFailed({ uuAppErrorMap }, { cause: error });
      }
      throw new Errors.ConfirmBorrowBook.CreateRentalFailedByDao({ uuAppErrorMap }, { cause: error });
    }

    // HDS 6
    try {
      await this.requestDao.deleteByCode(awid, dtoIn.requestCode);
    } catch (error) {
      throw new Errors.ConfirmBorrowBook.DeleteRequestFailedByDao({ uuAppErrorMap }, { cause: error });
    }
    // HDS 7
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "uu.library.team11@gmail.com",
        pass: "hesloprotest123"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: "Knihovna",
      to: request.customer.email,
      subject: `${dtoIn.emailSubject}`,
      text: `${dtoIn.emailText}`
    };

    transporter.sendMail(
      mailOptions,
      await function(error, info) {
        if (error) {
          uuAppErrorMap = { ...error };
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    //HDS 8
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async declineBorrowBook(awid, dtoIn) {
    //HDS 1.2, 1.3, A1, A2
    let validationResult = this.validator.validate("rentalDeclineBorrowBookDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.declineBorowBookUnsupportedKeys.code,
      Errors.DeclineBorrowBook.InvalidDtoIn
    );
    // HDS 2
    let request = await this.requestDao.getByCode(awid, dtoIn.requestCode);
    if (!request) {
      // A3
      throw new Errors.DeclineBorrowBook.RequestDoesNotExist({ uuAppErrorMap }, { code: dtoIn.requestCode });
    }
    // HDS 2.2
    let requestType = request.code.split("-");
    if (requestType[0] !== "BORROW") {
      // A4
      throw new Errors.DeclineBorrowBook.IsNotBorrowRequest(
        { uuAppErrorMap },
        { code: request.code, expectType: "borrow" }
      );
    }

    // HDS 3
    try {
      await this.requestDao.deleteByCode(awid, dtoIn.requestCode);
    } catch (error) {
      throw new Errors.DeclineBorrowBook.DeleteRequestFailedByDao({ uuAppErrorMap }, { cause: error });
    }

    // HDS 4
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "uu.library.team11@gmail.com",
        pass: "hesloprotest123"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: "Knihovna",
      to: request.customer.email,
      subject: `${dtoIn.emailSubject}`,
      text: `${dtoIn.emailText}`
    };

    transporter.sendMail(
      mailOptions,
      await function(error, info) {
        if (error) {
          uuAppErrorMap = { ...error };
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    //HDS 8
    return { uuAppErrorMap };
  }

  addOneMonth(date) {
    let splitedDate = date.split("-");
    let day = splitedDate[0];
    let month = splitedDate[1];
    let monthInt = Number(month);
    monthInt += 1;
    month = `0${monthInt}`;
    let year = splitedDate[2];
    return [day, month, year].join("-");
  }
}

module.exports = new RentalAbl();
