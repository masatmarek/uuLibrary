"use strict";
const LibraryMainAbl = require("../../abl/library-main-abl.js");

class LibraryMainController {
  libraryGet(ucEnv) {
    return LibraryMainAbl.libraryGet(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  libraryCreate(ucEnv) {
    return LibraryMainAbl.libraryCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  init(ucEnv) {
    return LibraryMainAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new LibraryMainController();
