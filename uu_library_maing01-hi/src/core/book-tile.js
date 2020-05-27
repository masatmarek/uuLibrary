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
import UpdateBookModal from "./update-book-modal";

import Form from "./create-book-modal";

import Lsi from "./book-list-lsi.js";
//@@viewOff:imports

export const BookTile = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "BookTile",
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
        `,
      genreBadge: () => Config.Css.css`
        margin-right: 5px;
        margin-bottom: 5px;
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    route: UU5.PropTypes.object,
    onDelete: UU5.PropTypes.func,
    onRelocate: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._listDataManager = UU5.Common.Reference.create();
    this._createModal = UU5.Common.Reference.create();
    this._updateModal = UU5.Common.Reference.create();
    this._newLocation = {};
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _openRequestCreateModal(data) {
    let date = new Date();
    let today = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate()}`;
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
      <UU5.Forms.Form onSave={formRef => this._handleCreateRequest(formRef, data.code)}>
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
  },
  _handleCreateRequest({ values, component }, code) {
    values.bookCode = code;
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
                    <UU5.Bricks.Lsi lsi={Lsi.book} />
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

  _getTileActionList(tileData) {
    let actions = [];
    let permissions = JSON.parse(localStorage.getItem("permission"));
    if (
      permissions.includes("Administrators") ||
      permissions.includes("Managers") ||
      permissions.includes("Librarians")
    ) {
      actions = [
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.updateButton} />,
          onClick: () => {
            this._openUpdateModal(tileData);
          },
          bgStyle: "filled",
          priority: 0
        },
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.relocateButton} />,
          onClick: () => {
            this._openRelocateModal(tileData);
          },
          bgStyle: "filled",
          priority: 0
        },
        {
          content: <UU5.Bricks.Lsi lsi={Lsi.deleteButton} />,
          onClick: () => {
            this._openDeleteModal(tileData);
          },
          bgStyle: "filled",
          priority: 0
        }
      ];
      if (tileData.state === "available") {
        actions.push({
          content: <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
          onClick: () => this._openRequestCreateModal(tileData),
          bgStyle: "filled",
          colorSchema: "success",
          priority: 1
        });
      }
      if (tileData.state === "reserved") {
        actions.push({
          content: <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
          disabled: true,
          bgStyle: "filled",
          colorSchema: "success",
          priority: 1
        });
      }
      return actions;
    } else if (permissions.includes("Customers")) {
      if (tileData.state === "available") {
        return [
          {
            content: <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
            onClick: () => this._openRequestCreateModal(tileData),
            bgStyle: "filled",
            colorSchema: "success",
            priority: 1
          }
        ];
      } else {
        return [];
      }
    } else {
      return [];
    }
  },
  _handleRelocate(formRef, book) {
    formRef.values.code = book.code;
    formRef.component.saveDone(formRef.values);
  },

  _handleRelocateDone(dtoOut) {
    this.props.onRelocate && this.props.onRelocate(dtoOut.dtoOut);
    ModalHelper.close();
  },
  _handleDelete(formRef, code) {
    formRef.component.saveDone({ code });
  },

  _handleDeleteDone(dtoOut) {
    this.props.onDelete && this.props.onDelete(dtoOut.dtoOut);
    ModalHelper.close();
  },
  _getLocations(book) {
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
            data.itemList.forEach(item => {
              if (book.locationCode !== item.code) {
                options.push(<UU5.Forms.Select.Option key={item.code} value={item.code} content={item.name} />);
              }
            });
            return (
              <UU5.Forms.Form
                onSave={formRef => this._handleRelocate(formRef, book)}
                onSaveDone={this._handleRelocateDone}
              >
                <UU5.Forms.Select
                  name="locationCode"
                  openToContent
                  labelColWidth={{ xs: 12 }}
                  inputColWidth={{ xs: 12 }}
                  label={<UU5.Bricks.Lsi lsi={Lsi.genreLabel} />}
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
  },
  _openRelocateModal(data) {
    ModalHelper.open(<UU5.Bricks.Lsi lsi={Lsi.relocateBook} />, this._getLocations(data));
  },
  _openDeleteModal(data) {
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.deleteBook} />,
      <UU5.Forms.Form
        onSave={formRef => this._handleDelete(formRef, data.code)}
        onSaveDone={this._handleDeleteDone}
        onSaveFail={this._handleDeleteFail}
      >
        <UU5.Bricks.Lsi lsi={Lsi.areYouSure(data.name)} />
        <UU5.Forms.ContextControls
          buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.delete} />, colorSchema: "danger" }}
          buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
        />
      </UU5.Forms.Form>
    );

    //this._deleteModal.current.open(data);
  },
  _openUpdateModal(data) {
    console.log(this._updateModal);

    this._updateModal.current.open(data);
  },
  _getBookInfoLine(name, value) {
    let classNames = this.getClassName();
    return (
      <UU5.Bricks.Div key={UU5.Common.Tools.generateUUID(4)}>
        <UU5.Bricks.Lsi lsi={Lsi[name]} className={classNames.boldText()} />
        :&nbsp;&nbsp;
        <UU5.Bricks.Span content={value} />
      </UU5.Bricks.Div>
    );
  },
  _getGenre(genreCodes = []) {
    let classNames = this.getClassName();
    let library = JSON.parse(localStorage.getItem("library"));
    let libraryGenresCodes = {};
    library.genres.forEach(genre => {
      libraryGenresCodes[genre.code] = genre.name;
    });
    let result = [];
    genreCodes.forEach(genre => {
      result.push(
        <UU5.Bricks.Label
          className={classNames.genreBadge()}
          colorSchema={library.colorSchema}
          content={<UU5.Bricks.Lsi lsi={libraryGenresCodes[genre]} />}
        />
      );
    });

    return this._getBookInfoLine("genre", result);
  },
  _getCondition(code) {
    let libraryString = localStorage.getItem("library");
    let library = JSON.parse(libraryString);
    let result;
    library.conditions.forEach(condition => {
      if (condition.code === code) {
        result = this._getBookInfoLine("condition", <UU5.Bricks.Lsi lsi={condition.name} />);
      }
    });
    return result;
  },

  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { name, code, author, locationCode, state, conditionCode, genreCodes, details } = this.props.data;
    return (
      <>
        <UuP.Tiles.ActionTile
          {...this.getMainPropsToPass()}
          key={UU5.Common.Tools.generateUUID(4)}
          actionList={this._getTileActionList(this.props.data)}
          header={name}
          level={4}
          content={
            <UU5.Bricks.Div key={UU5.Common.Tools.generateUUID(4)}>
              {this._getBookInfoLine("author", author)}
              {this._getBookInfoLine("code", code)}
              {this._getBookInfoLine("location", locationCode)}
              {this._getBookInfoLine("state", <UU5.Bricks.Lsi lsi={Lsi[state]} />)}
              {this._getCondition(conditionCode)}
              {this._getGenre(genreCodes)}
              {this._getBookInfoLine("publisher", details.publisher)}
              {this._getBookInfoLine("dateOfPublication", details.dateOfPublication)}
              {this._getBookInfoLine("language", details.language)}
              {this._getBookInfoLine("custody", <UU5.Bricks.Lsi lsi={Lsi[details.custody]} />)}
              {this._getBookInfoLine("numberOfPages", details.numberOfPages)}
            </UU5.Bricks.Div>
          }
        />
        <UpdateBookModal ref_={this._updateModal} />
      </>
    );
  }
  //@@viewOff:render
});

export default BookTile;
