/**
 * Server calls of application client.
 */
import * as UU5 from "uu5g04";
import Plus4U5 from "uu_plus4u5g01";

let Calls = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),

  promisedCall(method, url, dtoIn, clientOptions) {
    return Plus4U5.Common.Calls.call(method, url, dtoIn, clientOptions);
  },
  getLibrary(dtoIn) {
    let commandUri = Calls.getCommandUri("library/get");
    Calls.promisedCall("get", commandUri, dtoIn);
  },
  loadDemoContent(dtoIn) {
    let commandUri = Calls.getCommandUri("loadDemoContent");
    return Calls.call("get", commandUri, dtoIn);
  },
  profileList(dtoIn) {
    let commandUri = Calls.getCommandUri("location/getProfiles");
    return Calls.promisedCall("get", commandUri, dtoIn);
  },
  syslistPermissions(dtoIn) {
    let commandUri = Calls.getCommandUri("sys/listPermissions");
    Calls.promisedCall("get", commandUri, dtoIn);
  },
  locationList(dtoIn) {
    let commandUri = Calls.getCommandUri("location/list");
    return Calls.promisedCall("get", commandUri, dtoIn);
  },
  bookList(dtoIn) {
    let commandUri = Calls.getCommandUri("book/list");
    return Calls.promisedCall("get", commandUri, dtoIn);
  },
  genreList(dtoIn) {
    let commandUri = Calls.getCommandUri("genre/list");
    return Calls.promisedCall("get", commandUri, dtoIn);
  },
  genreGet(dtoIn) {
    let commandUri = Calls.getCommandUri("genre/get");
    Calls.promisedCall("get", commandUri, dtoIn);
  },
  requestCreate(dtoIn) {
    let commandUri = Calls.getCommandUri("request/create");
    Calls.promisedCall("post", commandUri, dtoIn);
  },
  conditionGet(dtoIn) {
    let commandUri = Calls.getCommandUri("condition/get");
    Calls.promisedCall("get", commandUri, dtoIn);
  },
  rentalBorowBook(dtoIn) {
    let commandUri = Calls.getCommandUri("rental/borrowBook");
    return Calls.promisedCall("post", commandUri, dtoIn);
  },
  bookCreate(dtoIn) {
    let commandUri = Calls.getCommandUri("book/create");
    return Calls.promisedCall("post", commandUri, dtoIn);
  },
  bookUpdate(dtoIn) {
    let commandUri = Calls.getCommandUri("book/update");
    return Calls.promisedCall("post", commandUri, dtoIn);
  },
  bookDelete(dtoIn) {
    let commandUri = Calls.getCommandUri("book/delete");
    return Calls.promisedCall("post", commandUri, dtoIn);
  },
  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json, for example:
   {
     ...
     "uu5Environment": {
       "gatewayUri": "https://uuos9.plus4u.net",
       "tid": "84723877990072695",
       "awid": "b9164294f78e4cd51590010882445ae5",
       "vendor": "uu",
       "app": "demoappg01",
       "subApp": "main"
     }
   }
   */
  getCommandUri(aUseCase) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    let targetUriStr = Calls.APP_BASE_URI + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    if (process.env.NODE_ENV !== "production") {
      let env = UU5.Environment;
      if (env.tid || env.awid || env.vendor || env.app) {
        let url = Plus4U5.Common.Url.parse(targetUriStr);
        if (env.tid || env.awid) {
          if (env.gatewayUri) {
            let match = env.gatewayUri.match(/^([^:]*):\/\/([^/]+?)(?::(\d+))?(\/|$)/);
            if (match) {
              url.protocol = match[1];
              url.hostName = match[2];
              url.port = match[3];
            }
          }
          if (env.tid) url.tid = env.tid;
          if (env.awid) url.awid = env.awid;
        }
        if (env.vendor || env.app) {
          if (env.vendor) url.vendor = env.vendor;
          if (env.app) url.app = env.app;
          if (env.subApp) url.subApp = env.subApp;
        }
        targetUriStr = url.toString();
      }
    }

    return targetUriStr;
  }
};

export default Calls;
