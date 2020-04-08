"use strict";
const LibraryMainAbl = require("../../abl/library-main-abl.js");

class LibraryMainController {
  init(ucEnv) {
    return LibraryMainAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new LibraryMainController();
