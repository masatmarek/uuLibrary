//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import RequestList from "../core/request-list";

import Lsi from "../config/lsi.js";
//@@viewOff:imports

export const Requests = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Requests",
    classNames: {
      main: () => Config.Css.css``,
      header: () => Config.Css.css`
        text-align: center;
      `
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Header
          level="0"
          content={
            <UU5.Bricks.Div className={this.getClassName().header()}>
              <UU5.Bricks.Lsi lsi={Lsi.request.header} />
            </UU5.Bricks.Div>
          }
        />
        <RequestList type="borrow" />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Requests;
