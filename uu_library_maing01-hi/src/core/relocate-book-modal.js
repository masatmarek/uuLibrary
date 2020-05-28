//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

import Calls from "../calls";
import ModalHelper from "../helpers/modal-helper.js";

import Lsi from "./relocate-book-modal-lsi";
//@@viewOff:imports
export const RelocateBookModal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "RelocateBookModal",
    classNames: {
      main: () => Config.Css.css``
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onRelocate: UU5.PropTypes.func.isRequired,
    code: UU5.PropTypes.string.isRequired,
    locationCode: UU5.PropTypes.string.isRequired
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
  _handleRelocate(formRef) {
    formRef.values.code = this.props.code;
    formRef.component.saveDone(formRef.values);
  },

  _handleRelocateDone(dtoOut) {
    this.props.onRelocate && this.props.onRelocate(dtoOut.dtoOut);
    ModalHelper.close();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Loader onLoad={Calls.locationListLoader}>
        {({ isLoading, isError, data }) => {
          if (isLoading) {
            return <UU5.Bricks.Loading />;
          } else if (isError) {
            console.log(isError);
            return <></>;
          } else {
            let options = [];
            console.log(data);

            data.itemList.forEach(item => {
              if (this.props.locationCode !== item.code) {
                options.push(<UU5.Forms.Select.Option key={item.code} value={item.code} content={item.name} />);
              }
            });
            return (
              <UU5.Forms.Form onSave={formRef => this._handleRelocate(formRef)} onSaveDone={this._handleRelocateDone}>
                <UU5.Forms.Select
                  name="locationCode"
                  openToContent
                  labelColWidth={{ xs: 12 }}
                  inputColWidth={{ xs: 12 }}
                  label={<UU5.Bricks.Lsi lsi={Lsi.locationLabel} />}
                  placeholder={"Vyberte novou lokaci"}
                >
                  {options}
                </UU5.Forms.Select>
                <UU5.Forms.ContextControls
                  buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.relocateButton} /> }}
                  buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
                />
              </UU5.Forms.Form>
            );
          }
        }}
      </UU5.Common.Loader>
    );
  }
  //@@viewOff:render
});

export default RelocateBookModal;
