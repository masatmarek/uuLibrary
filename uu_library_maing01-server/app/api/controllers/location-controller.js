"use strict";
const LocationAbl = require("../../abl/location-abl.js");

class LocationController {
  create(ucEnv) {
    return LocationAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  delete(ucEnv) {
    return LocationAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  getProfiles(ucEnv) {
    return LocationAbl.getProfiles(ucEnv.getAuthorizationResult());
  }
}

module.exports = new LocationController();
