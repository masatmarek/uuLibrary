//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";
import "uu_pg01-bricks";
import "uu_pg01-tiles";

import Calls from "../calls";
import Config from "./config/config.js";

import Lsi from "./create-book-modal-lsi.js";
//@@viewOff:imports

export const CreateBookModal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CreateBookModal",
    classNames: {
      main: () => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onCreate: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { onCreate: null };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._descriptionEditor = UU5.Common.Reference.create();
    this._modal = UU5.Common.Reference.create();
    this._alertBus = UU5.Common.Reference.create();
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open() {
    console.log("asd");

    this._modal.current.open({
      header: this._getHeader(),
      content: this._getForm(),
      footer: this._getControls(),
      id: UU5.Common.Tools.generateUUID(6)
    });
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getHeader() {
    return (
      <UU5.Forms.ContextHeader
        info={<UU5.Bricks.Lsi lsi={Lsi.modalHelpCreate} />}
        content={<UU5.Bricks.Lsi lsi={Lsi.modalHeaderCreate} />}
      />
    );
  },

  _handleCreate({ component, values }) {
    let details = {
      publisher: values.publisher,
      dateOfPublication: values.dateOfPublication,
      language: values.language,
      custody: values.custody,
      numberOfPages: values.numberOfPages
    };
    values.details = details;

    delete values.publisher;
    delete values.dateOfPublication;
    delete values.language;
    delete values.custody;
    delete values.numberOfPages;
    console.log(values);

    values = { ...values };
    values.locationCode = UU5.Common.Tools.getUrlParam("code");
    component.saveDone(values);
  },

  _handleCreateDone(dtoOut) {
    this._modal.current.close();
    this._alertBus.current.setAlert(
      {
        content: <UU5.Bricks.Div content={<UU5.Bricks.Lsi lsi={Lsi.success} />} />,
        colorSchema: "success"
      },
      () => this.props.onCreate && this.props.onCreate(dtoOut.dtoOut)
    );
  },

  _handleCreateFail() {
    this._alertBus.current.setAlert({
      content: <UU5.Bricks.Div content={<UU5.Bricks.Lsi lsi={Lsi.fail} />} />,
      colorSchema: "danger"
    });
  },
  _getForm() {
    let library = JSON.parse(localStorage.getItem("library"));
    let authors = JSON.parse(localStorage.getItem("authors"));
    let availableTags = [];
    authors.forEach(author => {
      availableTags.push({ value: author.code, content: author.name });
    });
    console.log(availableTags);

    return (
      <UU5.Forms.ContextForm
        onSave={formRef => this._handleCreate(formRef)}
        onSaveDone={this._handleCreateDone}
        onSaveFail={this._handleCreateFail}
        onCancel={this._closeModal}
      >
        <UU5.Forms.Text
          name="name"
          labelColWidth={{ xs: 12 }}
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.nameLabel} />}
          required
          requiredMessage={<UU5.Bricks.Lsi lsi={Lsi.required} />}
        />
        <UU5.Forms.Text
          name="publisher"
          labelColWidth={{ xs: 12 }}
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.publisher} />}
        />
        <UU5.Forms.DatePicker
          name="dateOfPublication"
          labelColWidth={{ xs: 12 }}
          format="dd:mm:Y"
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.dateOfPublication} />}
        />
        <UU5.Forms.Select
          name="language"
          labelColWidth={{ xs: 12 }}
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.language} />}
        >
          {library.languages.map(language => {
            return <UU5.Forms.Select.Option key={language} value={language} />;
          })}
        </UU5.Forms.Select>
        <UU5.Forms.SwitchSelector
          name="custody"
          items={[
            { content: <UU5.Bricks.Lsi lsi={{ cs: "Měkká", en: "Paperback" }} />, value: "paperback" },
            { content: <UU5.Bricks.Lsi lsi={{ cs: "Tvrdá", en: "Hardback" }} />, value: "hardback" }
          ]}
          label={<UU5.Bricks.Lsi lsi={Lsi.custody} />}
        />

        <UU5.Forms.Number
          name="numberOfPages"
          labelColWidth={{ xs: 12 }}
          inputColWidth={{ xs: 12 }}
          label={<UU5.Bricks.Lsi lsi={Lsi.numberOfPages} />}
        />

        <UU5.Forms.TagSelect
          label="Label"
          feedback="initial"
          name="authorCodes"
          size="m"
          disabled={false}
          readOnly={false}
          borderRadius={2}
          allowCustomTags={false}
          availableTags={availableTags}
          multiple
          onChange={false}
          onValidate={false}
        />
        <UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth={{ xs: 12, s: 6 }}>
            <UU5.Forms.Select
              name="genreCodes"
              multiple
              labelColWidth={{ xs: 12 }}
              inputColWidth={{ xs: 12 }}
              label={<UU5.Bricks.Lsi lsi={Lsi.genreLabel} />}
              placeholder={"Vyberte alespoň jeden žánr"}
            >
              {library.genres.map(genre => {
                return (
                  <UU5.Forms.Select.Option
                    key={genre.code}
                    value={genre.code}
                    content={<UU5.Bricks.Lsi lsi={genre.name} />}
                  />
                );
              })}
            </UU5.Forms.Select>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth={{ xs: 12, s: 6 }}>
            <UU5.Forms.Select
              name="conditionCode"
              labelColWidth={{ xs: 12 }}
              inputColWidth={{ xs: 12 }}
              label={<UU5.Bricks.Lsi lsi={Lsi.conditionLabel} />}
              placeholder={"Vyberte kondici knihy"}
            >
              {library.conditions.map(condition => {
                return (
                  <UU5.Forms.Select.Option
                    key={condition.code}
                    value={condition.code}
                    content={<UU5.Bricks.Lsi lsi={condition.name} />}
                  />
                );
              })}
            </UU5.Forms.Select>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Forms.ContextForm>
    );
  },

  _getControls() {
    return (
      <UU5.Forms.ContextControls
        buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.create} /> }}
        buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
      />
    );
  },

  _closeModal() {
    this._modal.current.close();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.ContextModal ref_={this._modal} overflow={true} />
        <UU5.Bricks.AlertBus ref_={this._alertBus} location="portal" />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});
export default CreateBookModal;
