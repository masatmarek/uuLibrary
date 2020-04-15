//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";

import Config from "./config/config.js";

import Lsi from "./form-lsi";
//@@viewOff:imports

export const LocationBasicInfo = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "LocationBasicInfo",
    classNames: {
      main: Config.CSS + "form",
      nameRow: Config.Css.css`
      .uu5-bricks-column:first-child{
        padding-left: 0;
      }
      .uu5-bricks-column:last-child{
        padding-right: 0;
      }
    `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    handleOnSave: UU5.PropTypes.func,
    data: UU5.PropTypes.object,
    update: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      handleOnSave: null,
      data: {}
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._codeInput = UU5.Common.Reference.create();
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _convertNameToCode(name) {
    let code = "";
    for (let i = 0; i < name.length; i++) {
      if (name[i] === " ") {
        code += "-";
      } else {
        code += name[i].toLowerCase();
      }
    }
    return code;
  },
  _fillTheCodeField(opt) {
    let { value } = opt;
    let { component } = opt;
    component.setValue(value);
    if (!this.props.update) {
      this._codeInput.current.setValue(this._convertNameToCode(value));
    }
  },
  _handleOnSave(opt) {
    let { values } = opt;
    if (this.props.update) {
      values.code = this.props.data.code;
    }
    this.props.handleOnSave(values);
  },

  _handleOnCancel() {
    UU5.Environment.getPage()
      .getModal()
      .close();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.Form onSave={this._handleOnSave} onCancel={this._handleOnCancel}>
          <UU5.Bricks.Row className={this.getClassName().nameRow}>
            <UU5.Forms.Text
              name="name"
              labelColWidth={{ xs: 12 }}
              inputColWidth={{ xs: 12 }}
              label={<UU5.Bricks.Lsi lsi={Lsi.nameLabel} />}
              required
              onChange={this._fillTheCodeField}
              requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
              value={this.props.update ? this.props.data.name : ""}
            />
            {this.props.update ? null : (
              <UU5.Forms.Text
                name="code"
                labelColWidth={{ xs: 12 }}
                inputColWidth={{ xs: 12 }}
                label={<UU5.Bricks.Lsi lsi={Lsi.codeLabel} />}
                required
                ref_={this._codeInput}
                requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
              />
            )}
            <UU5.Forms.Text
              name="author"
              labelColWidth={{ xs: 12 }}
              inputColWidth={{ xs: 12 }}
              label={<UU5.Bricks.Lsi lsi={Lsi.authorLabel} />}
              required
              requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
              value={this.props.update ? this.props.data.author : ""}
            />
            {/* Todo: this will be select */}
            {this.props.update ? null : (
              <UU5.Forms.Text
                name="locationCode"
                labelColWidth={{ xs: 12 }}
                inputColWidth={{ xs: 12 }}
                label={<UU5.Bricks.Lsi lsi={Lsi.locationLabel} />}
                required
                requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
                value={this.props.update ? this.props.data.locationCode : ""}
              />
            )}
          </UU5.Bricks.Row>
          <UU5.Forms.Controls
            buttonSubmitProps={{
              content: <UU5.Bricks.Lsi lsi={this.props.update ? Lsi.update : Lsi.add} />
            }}
          />
        </UU5.Forms.Form>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default LocationBasicInfo;
