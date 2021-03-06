//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Calls from "../calls";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import SpaAuthenticated from "./spa-authenticated.js";
import SpaNotAuthenticated from "./spa-not-authenticated.js";

//@@viewOff:imports

const Spa = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.IdentityMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Spa",
    classNames: {
      main: () => Config.Css.css`
        .plus4u5-app-page-left-wrapper {
          border-right: 1px solid rgba(0, 0, 0, 0.12);
        }
      `
    },
    getDerivedStateFromError(error) {
      return { error };
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      error: null
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private

  //@@viewOff:private

  //@@viewOn:render
  render() {
    let child;
    if (this.state.error) {
      child = <Plus4U5.App.SpaError error={this.state.error} />;
    } else if (this.isAuthenticated()) {
      child = <SpaAuthenticated {...this.getMainPropsToPass()} identity={this.getIdentity()} />;
    } else if (this.isNotAuthenticated()) {
      child = <SpaNotAuthenticated {...this.getMainPropsToPass()} productInfo={{ baseUri: "" }} />;
    } else {
      child = <Plus4U5.App.SpaLoading {...this.getMainPropsToPass()} content="uuLibrary" />;
    }

    return child;
  }
  //@@viewOff:render
});

export default Spa;
