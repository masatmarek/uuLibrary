//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";
import "uu_plus4u5g01-bricks";
import "uu_plus4u5g01-console";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu_pg01-tiles";

import Config from "./config/config.js";
import Calls from "../calls";
import ModalHelper from "../helpers/modal-helper.js";

import Form from "./create-book-modal";

import Lsi from "./request-list-lsi.js";
//@@viewOff:imports

export const RequestList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "RequestList",
    classNames: {
      main: () => Config.Css.css``,
      boldText: () => Config.Css.css`
        font-weight: bold;
      `,
      confirmDeleteModal: () => Config.Css.css`
        .uu5-bricks-modal-footer{
          display: flex;
          flex-direction: row-reverse;
        }
      `,
      cancelButton: () => Config.Css.css`
        margin-right: 4px;
    `,
      header: () => Config.Css.css`
        color: #1976D2;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
    `,
      richTextLabel: () =>
        Config.Css.css`
        padding-bottom: 6px;
      ` + " uu5-forms-label",
      richTextLabelDiv: () => Config.Css.css`
     padding: 0 0 6px 0;
     margin-top: 24px;
     `,
      editor: () => Config.Css.css` margin-top: 0`
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._listDataManager = UU5.Common.Reference.create();
    this._profileList = [];
    this._descriptionEditor = UU5.Common.Reference.create();
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLoad() {
    let data = { type: this.props.types };
    return new Promise((done, fail) =>
      Calls.requestList({
        data,
        done: data => {
          for (let conf of data.itemList) {
            conf.id = conf.code;
          }
          done(data);
        },
        fail
      })
    );
  },
  _handleConfirmBorrow({ values, component }, code) {
    values.requestCode = code;
    return new Promise((resolve, reject) => {
      Calls.rentalConfirmBorrowBook({
        data: values,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: <UU5.Bricks.Lsi lsi={Lsi[failDtoOut.code]} /> });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
  },
  _handleDeclineBorrow({ values, component }, code) {
    values.requestCode = code;
    return new Promise((resolve, reject) => {
      Calls.rentalDeclineBorrowBook({
        data: values,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: <UU5.Bricks.Lsi lsi={Lsi[failDtoOut.code]} /> });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
  },
  _getTileActionList(tileData) {
    let permissions = JSON.parse(localStorage.getItem("permission"));

    if (
      permissions.includes("Administrators") ||
      permissions.includes("Managers") ||
      permissions.includes("Librarians")
    ) {
      return [
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.confirmButton} />,
          onClick: () => {
            this._openHandleModal(tileData, "confirm");
          },
          bgStyle: "outline",
          colorSchema: "success",
          priority: 1
        },
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.declineButton} />,
          onClick: () => {
            this._openHandleModal(tileData, "decline");
          },
          bgStyle: "outline",
          colorSchema: "danger",
          priority: 1
        }
      ];
    } else {
      return [];
    }
  },
  _setRoute(code) {
    UU5.Environment.setRoute("location", { code });
  },
  _openHandleModal(data, type) {
    let classNames = this.getClassName();
    let modal = UU5.Environment.getPage().getModal();
    modal.open({
      header: <UU5.Bricks.Lsi lsi={type === "confirm" ? Lsi.confirm : Lsi.decline} />,
      content: (
        <UU5.Forms.Form
          // eslint-disable-next-line react/jsx-no-bind
          onSave={formRef => {
            type === "confirm"
              ? this._handleConfirmBorrow(formRef, data.code)
              : this._handleDeclineBorrow(formRef, data.code);
          }}
        >
          <UU5.Forms.Text
            name="emailSubject"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            label={<UU5.Bricks.Lsi lsi={Lsi.emailSubjectLabel} />}
            required
            value={type === "confirm" ? "Potvrzení výpůjčky" : "Zamítnutí výpujčky"}
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.TextArea
            name="emailText"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            label={<UU5.Bricks.Lsi lsi={Lsi.emailTextLabel} />}
            required
            rows={6}
            value={
              type === "confirm"
                ? "Ahoj,\npotvrzujeme tvojí žádost o výpůjčku knihy: 'xxx'. \n \nMěstská knihovna Praha"
                : "Ahoj,\nbohužel není z nějakého důvodu možné potvrdit zapůjčení knihy. Pro více informací nás prosím kontaktuj. \n \nMěstská knihovna Praha"
            }
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.ContextControls
            buttonSubmitProps={{
              content: <UU5.Bricks.Lsi lsi={type === "confirm" ? Lsi.confirmButton : Lsi.declineButton} />,
              colorSchema: type === "confirm" ? "success" : "danger"
            }}
            buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
          />
        </UU5.Forms.Form>
      ),
      className: classNames.confirmDeleteModal()
    });
  },
  _openCreateModal() {
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.createFeeConfiguration} />,
      <Form handleOnSave={this._listDataManager.current.create} update={false} id={UU5.Common.Tools.generateUUID(6)} />
    );
  },
  _openUpdateModal(data) {
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.createFeeConfiguration} />,
      <Form
        handleOnSave={this._listDataManager.current.update}
        data={data}
        update={true}
        id={UU5.Common.Tools.generateUUID(6)}
      />
    );
  },
  _getLocationInfoLine(name, value) {
    let classNames = this.getClassName();
    return (
      <UU5.Bricks.Div key={UU5.Common.Tools.generateUUID(4)}>
        <UU5.Bricks.Lsi lsi={Lsi[name]} className={classNames.boldText()} />
        :&nbsp;&nbsp;
        <UU5.Bricks.Span content={value} />
      </UU5.Bricks.Div>
    );
  },

  _renderTile(tileInfo) {
    return (
      <UuP.Tiles.ActionTile
        key={UU5.Common.Tools.generateUUID(4)}
        actionList={this._getTileActionList(tileInfo.data)}
        header={<UU5.Bricks.Lsi lsi={Lsi.request} />}
        level={4}
        content={
          <UU5.Bricks.Div key={UU5.Common.Tools.generateUUID(4)}>
            {this._getLocationInfoLine("code", tileInfo.code)}
            {this._getLocationInfoLine("bookCode", tileInfo.bookCode)}
            {this._getLocationInfoLine("from", tileInfo.from)}
            {this._getLocationInfoLine("customer", tileInfo.customer.name)}
          </UU5.Bricks.Div>
        }
      />
    );
  },
  _getLocations() {
    return (
      <UU5.Common.ListDataManager
        ref_={this._listDataManager}
        onLoad={this._handleLoad}
        onCreate={this._handleCreate}
        onUpdate={this._handleUpdate}
        onDelete={this._handleDelete}
      >
        {({ errorState, errorData, data }) => {
          if (errorState && errorState !== "create" && errorState !== "update") {
            return <UU5.Bricks.Error data={errorData} />;
          } else if (data) {
            return (
              <UU5.Bricks.Div>
                <UU5.Tiles.ListController data={data} selectable={false}>
                  <UU5.Tiles.ActionBar
                    collapsible={false}
                    title={<UU5.Bricks.Lsi lsi={Lsi.requestList} />}
                    searchable={true}
                  />
                  <UU5.Tiles.List
                    tile={this._renderTile}
                    tileBorder
                    tileStyle={{ borderRadius: 4 }}
                    tileMinWidth={330}
                    tileHeight={170}
                    rowSpacing={8}
                    tileSpacing={8}
                    tileJustify="space-between"
                    scrollToAlignment="center"
                  />
                </UU5.Tiles.ListController>
              </UU5.Bricks.Div>
            );
          } else {
            return <UU5.Bricks.Loading />;
          }
        }}
      </UU5.Common.ListDataManager>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getLocations()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default RequestList;
