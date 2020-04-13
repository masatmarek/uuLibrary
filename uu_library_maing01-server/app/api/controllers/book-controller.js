"use strict";
const BookAbl = require("../../abl/book-abl.js");

class BookController {

  delete(ucEnv) {
    return BookAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  setState(ucEnv) {
    return BookAbl.setState(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  return(ucEnv) {
    return BookAbl.return(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  relocate(ucEnv) {
    return BookAbl.relocate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  borrow(ucEnv) {
    return BookAbl.borrow(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult().getAuthorizedProfiles()
    );
  }
  getProfiles(ucEnv) {
    return BookAbl.getProfiles(ucEnv.getAuthorizationResult());
  }

  list(ucEnv) {
    return BookAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return BookAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return BookAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new BookController();
