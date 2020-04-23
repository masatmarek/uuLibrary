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
import BookTile from "./book-tile";
import CreateBookModal from "./create-book-modal";

import Lsi from "./book-list-lsi.js";
//@@viewOff:imports

export const BookList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "BookList",
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
      getBackDiv: () => Config.Css.css`
        color: #bdbdbd;
        font-size: 16px;
        display: flex;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      `,
      getBackIcon: () => Config.Css.css`
        color: #757575;
        transform: rotate(90deg);
        font-size: 20px !important;
        `,
      link: () => Config.Css.css`
        cursor: pointer;
        text-decoration: underline !important;
        color: #1976D2 !important;
        `
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
    this._createModal = UU5.Common.Reference.create();
    this._updateModal = UU5.Common.Reference.create();
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLoad() {
    let locationCode = UU5.Common.Tools.getUrlParam("code");
    let data = { locationCode };
    return new Promise((done, fail) =>
      Calls.bookList({
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
  _handleCreate(data) {
    return new Promise((resolve, reject) => {
      Calls.bookCreate({
        data,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: failDtoOut.message });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
  },
  _handleDelete(code) {
    return new Promise((resolve, reject) => {
      Calls.bookDelete({
        data: code,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "success", content: <UU5.Bricks.Lsi lsi={Lsi.successDelete} /> });
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: failDtoOut.message });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
  },
  _handleRelocate(data) {
    console.log(data);

    return new Promise((resolve, reject) => {
      Calls.bookRelocate({
        data: data,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({
              colorSchema: "success",
              content: <UU5.Bricks.Lsi lsi={Lsi.successRelocate(dtoOut.locationCode)} />
            });
        },
        fail: failDtoOut => {
          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: failDtoOut.message });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
  },
  _getActionBarActions() {
    let permissions = JSON.parse(localStorage.getItem("permission"));

    if (
      permissions.includes["Administrators"] ||
      permissions.includes("Managers") ||
      permissions.includes("Librarirans")
    ) {
      return [
        {
          content: "Create",
          onClick: this._openCreateModal,
          icon: "mdi-plus-circle",
          active: true
        }
      ];
    }
  },

  _openCreateModal() {
    this._createModal.current.open();
  },
  _renderTile(tileInfo) {
    return (
      <BookTile key={tileInfo.code} data={tileInfo} onDelete={this._handleDelete} onRelocate={this._handleRelocate} />
    );
  },
  _getBooks() {
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
                    title={
                      <UU5.Bricks.Button bgStyle="transparent" onClick={() => UU5.Environment.setRoute("location")}>
                        <UU5.Bricks.Icon icon="mdi-arrow-left" />
                      </UU5.Bricks.Button>
                    }
                    searchable={true}
                    actions={this._getActionBarActions()}
                  />
                  <UU5.Tiles.List
                    tile={this._renderTile}
                    tileBorder
                    tileStyle={{ borderRadius: 4 }}
                    tileMinWidth={445}
                    tileHeight={230}
                    rowSpacing={8}
                    tileSpacing={8}
                    tileJustify="space-between"
                    scrollToAlignment="center"
                  />
                </UU5.Tiles.ListController>
                <CreateBookModal
                  onCreate={newData => this._listDataManager.current.create({ ...data, ...newData })}
                  id={UU5.Common.Tools.generateUUID(6)}
                  ref_={this._createModal}
                />
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
    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getBooks()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default BookList;
