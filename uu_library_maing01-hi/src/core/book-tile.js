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
import DeleteBookModal from "./delete-book-modal";
import RelocateBookModal from "./relocate-book-modal";
import CreateRequestModal from "./create-request-modal";

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
      genreBadge: () => Config.Css.css`
        margin-right: 5px;
        margin-bottom: 5px;
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    onDelete: UU5.PropTypes.func.isRequired,
    onRelocate: UU5.PropTypes.func.isRequired,
    onUpdate: UU5.PropTypes.func.isRequired
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
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.borrowButton} />,
      <CreateRequestModal name={data.name} code={data.code} />
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
  _openRelocateModal(data) {
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.relocateBook} />,
      <RelocateBookModal onRelocate={this.props.onRelocate} code={data.code} locationCode={data.locationCode} />
    );
  },
  _openDeleteModal(data) {
    ModalHelper.open(
      <UU5.Bricks.Lsi lsi={Lsi.deleteBook} />,
      <DeleteBookModal onDelete={this.props.onDelete} code={data.code} name={data.name} />
    );
  },
  _openUpdateModal(data) {
    this._updateModal.current.open(data);
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
  _getAuthors(authorCodes) {
    let classNames = this.getClassName();
    let authors = JSON.parse(localStorage.getItem("authors"));
    let storedAuthorCodes = {};
    authors.forEach(author => {
      storedAuthorCodes[author.code] = author.name;
    });
    let result = [];
    authorCodes.forEach(author => {
      result.push(<UU5.Bricks.Label className={classNames.genreBadge()} content={storedAuthorCodes[author]} />);
    });

    return this._getBookInfoLine("author", result);
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
    let { name, code, authorCodes, locationCode, state, conditionCode, genreCodes, details, id } = this.props.data;
    return (
      <>
        <UuP.Tiles.ActionTile
          {...this.getMainPropsToPass()}
          key={id}
          actionList={this._getTileActionList(this.props.data)}
          header={name}
          level={4}
          content={
            <>
              {this._getAuthors(authorCodes)}
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
            </>
          }
        />
        <UpdateBookModal ref_={this._updateModal} onUpdate={this.props.onUpdate} />
      </>
    );
  }
  //@@viewOff:render
});

export default BookTile;
