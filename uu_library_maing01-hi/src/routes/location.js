//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import BookList from "../core/book-list";
import LocationList from "../core/location-list";

import Lsi from "../config/lsi.js";
//@@viewOff:imports

export const Location = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Location",
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
              <UU5.Bricks.Lsi lsi={Lsi.location.header} />
              {this.props.params && this.props.params.code ? ` ${this.props.params.code}` : ""}
            </UU5.Bricks.Div>
          }
        />
        {this.props.params && this.props.params.code ? <BookList /> : <LocationList />}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Location;
