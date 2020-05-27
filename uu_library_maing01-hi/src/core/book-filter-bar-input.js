//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

import Lsi from "./book-filter-bar-input-lsi.js";
//@@viewOff:imports
export const BookFilterBarInput = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "BookFilterBarInput",

    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    activeFilter: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { activeFilter: "" };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private

  _getValueInput(key) {
    let states = {
      available: "available",
      borrowed: "borrowed"
    };
    let child;
    child = (
      <UU5.Forms.Select
        {...this.getMainPropsToPass()}
        name="value"
        labelColWidth="xs-12 m-5"
        inputColWidth="xs-12 m-7"
        label={<UU5.Bricks.Lsi lsi={Lsi.andHisValue} />}
        placeholder={<UU5.Bricks.Lsi lsi={Lsi.valuesOfFilter} />}
      >
        {Object.keys(states).map((state, index) => {
          return (
            <UU5.Forms.Select.Option
              key={`${state}_${index}`}
              value={states[state]}
              content={<UU5.Bricks.Lsi lsi={Lsi.stateMap[state]} />}
            />
          );
        })}
      </UU5.Forms.Select>
    );

    return child;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getValueInput(this.props.activeFilter);
  }
  //@@viewOff:render
});

export default BookFilterBarInput;
