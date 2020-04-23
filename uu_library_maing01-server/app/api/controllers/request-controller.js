"use strict";
const RequestAbl = require("../../abl/request-abl.js");

class RequestController {

  requestList(ucEnv) {
    return RequestAbl.requestList(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  requestCreate(ucEnv) {
    return RequestAbl.requestCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new RequestController();
