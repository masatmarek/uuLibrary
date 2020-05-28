//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

import ModalHelper from "../helpers/modal-helper.js";

import Lsi from "./delete-book-modal-lsi";
//@@viewOff:imports
export const BookFilterBarInput = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "DeleteBookModal",
    classNames: {
      main: () => Config.Css.css``
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onDelete: UU5.PropTypes.func.isRequired,
    code: UU5.PropTypes.string.isRequired,
    name: UU5.PropTypes.string.isRequired
  },
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

  _handleDelete(formRef, code) {
    formRef.component.saveDone({ code });
  },

  _handleDeleteDone(dtoOut) {
    console.log(this.props, dtoOut);
    this.props.onDelete && this.props.onDelete(dtoOut.dtoOut);
    ModalHelper.close();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Forms.Form
        onSave={formRef => this._handleDelete(formRef, this.props.code)}
        onSaveDone={this._handleDeleteDone}
        onSaveFail={this._handleDeleteFail}
      >
        <UU5.Bricks.Lsi lsi={Lsi.areYouSure(this.props.name)} />
        <UU5.Forms.ContextControls
          buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.delete} />, colorSchema: "danger" }}
          buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
        />
      </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default BookFilterBarInput;
