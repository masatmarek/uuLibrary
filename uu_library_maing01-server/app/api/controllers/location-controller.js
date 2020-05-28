"use strict";
const LocationAbl = require("../../abl/location-abl.js");

class LocationController {
  locationUpdate(ucEnv) {
    return LocationAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  close(ucEnv) {
    return LocationAbl.close(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  reactivate(ucEnv) {
    return LocationAbl.reactivate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  suspend(ucEnv) {
    return LocationAbl.suspend(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  setState(ucEnv) {
    return LocationAbl.setState(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  list(ucEnv) {
    return LocationAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
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
