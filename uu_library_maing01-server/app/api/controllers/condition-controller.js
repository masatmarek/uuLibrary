"use strict";
const ConditionAbl = require("../../abl/condition-abl.js");

class ConditionController {

  conditionGet(ucEnv) {
    return ConditionAbl.conditionGet(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  conditionDelete(ucEnv) {
    return ConditionAbl.conditionDelete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  conditionCreate(ucEnv) {
    return ConditionAbl.conditionCreate(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  conditionList(ucEnv) {
    return ConditionAbl.conditionList(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new ConditionController();
