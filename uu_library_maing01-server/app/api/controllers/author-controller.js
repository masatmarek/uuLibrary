"use strict";
const AuthorAbl = require("../../abl/author-abl.js");

class AuthorController {

  authorList(ucEnv) {
    return AuthorAbl.authorList(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  authorCreate(ucEnv) {
    return AuthorAbl.authorCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new AuthorController();
