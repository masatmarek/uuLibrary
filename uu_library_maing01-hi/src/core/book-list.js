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

import Form from "./form";

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
    this._profileList = [];
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLoad() {
    let data = {};
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
  _handleGetpermList() {
    let data = {
      uuIdentityList: UU5.Environment.getSession().getIdentity()
        ? UU5.Environment.getSession().getIdentity().uuIdentity
        : "0-0"
    };
    return new Promise((done, fail) =>
      Calls.syslistPermissions({
        data,
        done: data => {
          for (let perm of data.itemList) {
            this._profileList.push(perm.profileCode);
          }
          done(data);
        },
        fail: failDtoOut => {
          console.log(failDtoOut);
        }
      })
    );
  },
  _handleUpdate(data) {
    return new Promise((resolve, reject) => {
      Calls.bookUpdate({
        data,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
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
  _getTileActionList(tileData) {
    if (this._profileList.includes("Managers")) {
      return [
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.updateButton} />,
          onClick: () => {
            this._openUpdateModal(tileData);
          },
          bgStyle: "filled",
          priority: 0
        },
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.deleteButton} />,
          onClick: () => {
            this._openDeleteConfirmModal(tileData);
          },
          bgStyle: "filled",
          priority: 0
        },
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
          onClick: () => {
            console.log("This feature will be implemented in future");
          },
          bgStyle: "filled",
          colorSchema: "success",
          priority: 1,
          borderRadius: 5
        }
      ];
    } else if (this._profileList.includes("Customers") && !this._profileList.includes("Managers")) {
      return [
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
          onClick: () => {
            console.log("This feature will be implemented in future");
          },
          bgStyle: "filled",
          priority: 1
        }
      ];
    } else {
      return [];
    }
  },
  _getActionBarActions() {
    return [
      {
        content: "Create",
        onClick: this._openCreateModal,
        icon: "mdi-plus-circle",
        active: true
      }
    ];
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
  _getBookInfoLine(name, value) {
    let classNames = this.getClassName();
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Lsi lsi={Lsi[name]} className={classNames.boldText()} />
        :&nbsp;&nbsp;
        <UU5.Bricks.Span content={value} />
      </UU5.Bricks.Div>
    );
  },
  _renderTile(tileInfo) {
    return (
      <UuP.Tiles.ActionTile
        actionList={this._getTileActionList(tileInfo.data)}
        header={tileInfo.name}
        maxHeight
        level={4}
        content={
          <UU5.Bricks.Div>
            {this._getBookInfoLine("author", tileInfo.author)}
            {this._getBookInfoLine("location", tileInfo.locationCode)}
            {this._getBookInfoLine("state", <UU5.Bricks.Lsi lsi={Lsi[tileInfo.state]} />)}
          </UU5.Bricks.Div>
        }
      />
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
                    title=""
                    searchable={true}
                    actions={this._getActionBarActions()}
                  />
                  <UU5.Tiles.List
                    tile={this._renderTile}
                    tileBorder
                    tileStyle={{ borderRadius: 4 }}
                    tileMinWidth={345}
                    tileHeight={230}
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
    this._handleGetpermList();
    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getBooks()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default BookList;
