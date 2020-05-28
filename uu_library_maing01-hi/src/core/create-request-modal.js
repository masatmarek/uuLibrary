//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";
import Calls from "../calls";

import ModalHelper from "../helpers/modal-helper.js";

import Lsi from "./create-request-modal-lsi";
//@@viewOff:imports
export const CreateRequestModal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CreateRequestModal",
    classNames: {
      main: () => Config.Css.css``,
      link: () => Config.Css.css`
      cursor: pointer;
      text-decoration: underline !important;
      color: #1976D2 !important;
      `
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
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

  _handleCreateRequest({ values, component }) {
    values.bookCode = this.props.code;
    values.type = "borrow";
    values.from = `${values.from.getFullYear()}-${values.from.getMonth() + 1}-${values.from.getDate()}`;

    let classNames = this.getClassName();
    return new Promise((done, fail) =>
      Calls.requestCreate({
        data: values,
        done: data => {
          done(data);
          ModalHelper.close();
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({
              colorSchema: "success",
              closeTimer: 7000,
              content: (
                <UU5.Bricks.Span>
                  <UU5.Bricks.Lsi lsi={Lsi.successBorrowPrefix} />
                  &nbsp;
                  <UU5.Bricks.Link href="http://www.unicorn.com/" className={classNames.link()} target="_blank">
                    {this.props.name}
                  </UU5.Bricks.Link>
                  &nbsp;
                  <UU5.Bricks.Lsi lsi={Lsi.successBorrowSuffix} />
                </UU5.Bricks.Span>
              )
            });
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: failDtoOut.message });
          ModalHelper.close();
          fail(failDtoOut);
        }
      })
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let date = new Date();
    let today = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate()}`;
    return (
      <UU5.Forms.Form onSave={formRef => this._handleCreateRequest(formRef)}>
        <UU5.Forms.DatePicker
          openToContent
          name="from"
          value={today}
          labelColWidth={{ xs: 12 }}
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.fromLabel} />}
          dateFrom={today}
          required
          requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
        />
        <UU5.Forms.ContextControls
          buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.requestLabel} />, colorSchema: "blue" }}
          buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
        />
      </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default CreateRequestModal;
