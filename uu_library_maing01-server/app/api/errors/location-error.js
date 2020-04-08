"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error.js");
const LOCATION_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}location/`;

const Delete = {
  UC_CODE: `${LOCATION_ERROR_PREFIX}delete/`,
  
};

module.exports = {
  Delete
};
