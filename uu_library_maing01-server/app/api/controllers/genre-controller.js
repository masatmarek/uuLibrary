"use strict";
const GenreAbl = require("../../abl/genre-abl.js");

class GenreController {
  genreGet(ucEnv) {
    return GenreAbl.genreGet(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  genreList(ucEnv) {
    return GenreAbl.genreList(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  genreDelete(ucEnv) {
    return GenreAbl.genreDelete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  genreCreate(ucEnv) {
    return GenreAbl.genreCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new GenreController();
