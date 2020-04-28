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

import Lsi from "./location-list-lsi.js";
//@@viewOff:imports

export const LocationList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "LocationList",
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
      formControls: () => Config.Css.css`
        margin-top: 10px;
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
      Calls.locationList({
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

  _handleDelete({ values, component }, code) {
    console.log(values, code);
    values.code = code;
    return new Promise((resolve, reject) => {
      Calls.locationDelete({
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
  _handleCreate({ values, component }) {
    return new Promise((resolve, reject) => {
      Calls.locationCreate({
        data: values,
        done: dtoOut => {
          ModalHelper.close();
          resolve(dtoOut);
          this._listDataManager.current.load();
        },
        fail: failDtoOut => {
          console.log(failDtoOut.code);

          UU5.Environment.getPage()
            .getAlertBus()
            .setAlert({ colorSchema: "danger", content: <UU5.Bricks.Lsi lsi={Lsi[failDtoOut.code]} /> });
          ModalHelper.close();
          reject(failDtoOut);
        }
      });
    });
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
  _handleUpdate({ values, component }, code) {
    values.code = code;
    return new Promise((resolve, reject) => {
      Calls.locationUpdate({
        data: values,
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
        }
      ];
    } else {
      return [];
    }
  },
  _getActionBarActions() {
    if (this._profileList.includes("Managers")) {
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
  _setRoute(code) {
    UU5.Environment.setRoute("location", { code });
  },
  _openDeleteConfirmModal(data) {
    let classNames = this.getClassName();
    let modal = UU5.Environment.getPage().getModal();
    modal.open({
      header: <UU5.Bricks.Lsi lsi={Lsi.deleteLocation} />,
      content: (
        <UU5.Forms.Form onSave={formRef => this._handleDelete(formRef, data.code)}>
          <UU5.Forms.Checkbox label={<UU5.Bricks.Lsi lsi={Lsi.forceDelete} />} name="forceDelete" />
          <UU5.Forms.ContextControls
            buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.deleteButton} />, colorSchema: "danger" }}
            buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
          />
        </UU5.Forms.Form>
      ),
      className: classNames.confirmDeleteModal()
    });
  },
  _openCreateModal() {
    let classNames = this.getClassName();
    let modal = UU5.Environment.getPage().getModal();
    modal.open({
      header: <UU5.Bricks.Lsi lsi={Lsi.createLocation} />,
      content: (
        <UU5.Forms.Form onSave={formRef => this._handleCreate(formRef)}>
          <UU5.Forms.Text
            name="code"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            label={<UU5.Bricks.Lsi lsi={Lsi.codeLabel} />}
            required
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.Text
            name="name"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            label={<UU5.Bricks.Lsi lsi={Lsi.nameLabel} />}
            required
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.Number
            name="capacity"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            min={0}
            label={<UU5.Bricks.Lsi lsi={Lsi.capacityLabel} />}
            required
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.ContextControls
            className={classNames.formControls()}
            buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.createButton} />, colorSchema: "blue" }}
            buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
          />
        </UU5.Forms.Form>
      )
    });
  },

  _openUpdateModal(data) {
    let classNames = this.getClassName();
    let modal = UU5.Environment.getPage().getModal();
    modal.open({
      header: <UU5.Bricks.Lsi lsi={Lsi.createLocation} />,
      content: (
        <UU5.Forms.Form onSave={formRef => this._handleUpdate(formRef, data.code)}>
          <UU5.Forms.Text
            name="name"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            label={<UU5.Bricks.Lsi lsi={Lsi.nameLabel} />}
            required
            value={data.name}
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.Number
            name="capacity"
            labelColWidth={{ xs: 12 }}
            inputColWidth={{ xs: 12 }}
            min={0}
            label={<UU5.Bricks.Lsi lsi={Lsi.capacityLabel} />}
            required
            value={data.capacity}
            requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
          />
          <UU5.Forms.ContextControls
            className={classNames.formControls()}
            buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.updateButton} />, colorSchema: "blue" }}
            buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
          />
        </UU5.Forms.Form>
      )
    });
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
  _getTileHeader(data) {
    let classNames = this.getClassName();
    return (
      <UU5.Bricks.Span
        mainAttrs={{
          onClick: () => this._setRoute(data.code)
        }}
        className={classNames.header()}
      >
        {data.name}
      </UU5.Bricks.Span>
    );
  },
  _renderTile(tileInfo) {
    return (
      <UuP.Tiles.ActionTile
        key={UU5.Common.Tools.generateUUID(4)}
        actionList={this._getTileActionList(tileInfo.data)}
        header={this._getTileHeader(tileInfo)}
        level={4}
        content={
          <UU5.Bricks.Div key={UU5.Common.Tools.generateUUID(4)}>
            {this._getLocationInfoLine("codeLabel", tileInfo.code)}
            {this._getLocationInfoLine("state", <UU5.Bricks.Lsi lsi={Lsi[tileInfo.state]} />)}
            {this._getLocationInfoLine("capacity", tileInfo.capacity)}
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
                    title=""
                    searchable={true}
                    actions={this._getActionBarActions()}
                  />
                  <UU5.Tiles.List
                    tile={this._renderTile}
                    tileHeight={140}
                    rowSpacing={8}
                    tileSpacing={8}
                    tileElevationHover={3}
                    tileElevation={1}
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

    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getLocations()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default LocationList;
