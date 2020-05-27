//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

import Lsi from "./filter-bar-lsi";
//@@viewOff:imports
const buttonAddColumnClassName = Config.Css.css``;
const chooseFilterSelectClassName = Config.Css.css``;

export const FilterBar = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "FilterBar",
    classNames: {
      main: Config.Css.css`
      @media only screen and (max-width: 768px) {
          .${buttonAddColumnClassName} {
            text-align: center;
          }
      
          .${chooseFilterSelectClassName} {
            .uu5-forms-label {
              padding: 0 0 8px;
            }
          }
        }
      `,
      buttonAdd: Config.Css.css`
          margin: 24px;
      `,
      buttonAddColumn: buttonAddColumnClassName,
      chooseFilterSelect: chooseFilterSelectClassName
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appliedFilters: UU5.PropTypes.object,
    filters: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        key: UU5.PropTypes.string,
        label: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]),
        filterFn: UU5.PropTypes.func
      })
    ),
    addFilter: UU5.PropTypes.func,
    removeFilter: UU5.PropTypes.func,
    filterBar: UU5.PropTypes.object,
    data: UU5.PropTypes.array
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      appliedFilters: {},
      filters: [],
      addFilter: null,
      removeFilter: null,
      filterBar: {},
      data: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._form = UU5.Common.Reference.create();
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private

  _handleButton() {
    let values = this._form.current.getValues();
    let filters = this.props.filters;
    let indexOfItem = 0;
    for (let index = 0; index < filters.length; index++) {
      if (filters[index].key === values.type) {
        indexOfItem = index;
        break;
      }
    }
    // simple validation
    if (this._form.current.isValid() && values && values.type && values.type.length > 0) {
      this.props.addFilter(
        filters[indexOfItem].key,
        filters[indexOfItem].label,
        values.value,
        filters[indexOfItem].filterFn,
        null,
        () => this.setState({ activeItem: "" }, this.props.filterBar.collapse)
      );
    }
  },

  _getOptions() {
    return Object.keys(this.props.filters).map(idx => (
      <UU5.Forms.Select.Option
        key={idx}
        value={this.props.filters[idx].key}
        disabled={this.props.appliedFilters.hasOwnProperty(this.props.filters[idx].key)}
      >
        <UU5.Bricks.Lsi lsi={this.props.filters[idx].label} />
      </UU5.Forms.Select.Option>
    ));
  },

  _getValueInput(key) {
    return this.props.children({ activeFilter: key });
  },

  _handleFilterItem(e) {
    this.setState({ activeItem: e.value });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let classNames = this.getClassName();
    return (
      <UU5.Forms.Form {...this.getMainPropsToPass()} ref_={this._form} onSaveEnter={this._handleButton} noSpacing>
        <UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth="xs-12 s-6 m-5 l-5 xl-4" noSpacing>
            <UU5.Forms.Select
              name="type"
              labelColWidth="xs-12 s-11 m-4"
              inputColWidth="xs-12 s-11 m-6"
              label={<UU5.Bricks.Lsi lsi={Lsi.addItemToFilter} />}
              placeholder={<UU5.Bricks.Lsi lsi={Lsi.itemOfFilter} />}
              onChange={this._handleFilterItem}
              value={this.state.activeItem}
            >
              {this._getOptions()}
            </UU5.Forms.Select>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs-12 s-6 m-5 l-4 xl-3" noSpacing>
            {this._getValueInput(this.state.activeItem)}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column className={classNames.buttonAddColumn} colWidth="xs-12 m-2 xl-1" noSpacing>
            <UU5.Bricks.Button
              className={classNames.buttonAdd}
              onClick={this._handleButton}
              colorSchema="green"
              content={<UU5.Bricks.Lsi lsi={Lsi.add} />}
            />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default FilterBar;
