//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Calls from "../calls";
import Lsi from "../config/lsi.js";
import About from "../routes/about.js";
import Home from "../routes/home.js";
import Location from "../routes/location";
import Book from "../routes/book";
//@@viewOff:imports

const SpaNotAuthenticated = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaNotAuthenticated",
    classNames: {
      main: ""
    },
    lsi: {
      name: Lsi.appName
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: UU5.PropTypes.shape()
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      identity: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getLibrary() {
    return (
      <UU5.Common.Loader onLoad={Calls.getLibrary}>
        {({ isLoading, isError, data }) => {
          if (isLoading) {
            return <UU5.Bricks.Loading />;
          } else if (isError) {
            return <></>;
          } else {
            localStorage.setItem("library", JSON.stringify(data));
            return <></>;
          }
        }}
      </UU5.Common.Loader>
    );
  },
  _getpermissions() {
    let data = {
      uuIdentityList: UU5.Environment.getSession().getIdentity()
        ? UU5.Environment.getSession().getIdentity().uuIdentity
        : "0-0"
    };
    return (
      <UU5.Common.Loader onLoad={Calls.syslistPermissions} data={data}>
        {({ isLoading, isError, data }) => {
          if (isLoading) {
            return <UU5.Bricks.Loading />;
          } else if (isError) {
            return <></>;
          } else {
            let profiles = [];
            data.itemList.forEach(permission => {
              profiles.push(permission.profileCode);
            });
            localStorage.setItem("permission", JSON.stringify(profiles));
            return <></>;
          }
        }}
      </UU5.Common.Loader>
    );
  },
  _setRoute(route) {
    UU5.Environment.setRoute(route);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let library = JSON.parse(localStorage.getItem("library"));
    let permissions = JSON.parse(localStorage.getItem("permission"));

    const menuItems = [
      {
        id: "home",
        content: <UU5.Bricks.Lsi lsi={Lsi.leftLinks.home} />,
        onClick: () => this._setRoute("")
      },
      {
        id: "location",
        content: <UU5.Bricks.Lsi lsi={Lsi.leftLinks.location} />,
        onClick: () => this._setRoute("location")
      },
      {
        id: "book",
        content: <UU5.Bricks.Lsi lsi={Lsi.leftLinks.book} />,
        onClick: () => UU5.Environment.setRoute("book")
      }
    ];
    const executiveItems = [
      {
        content: <UU5.Bricks.Lsi lsi={Lsi.controlBar.contentManger} />,
        onClick: () => alert(`item "File manager" clicked`)
      }
    ];
    return (
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        displayedLanguages={library.languages}
        type={3}
        topFixed="smart"
        topFixedHeight={64}
        leftFixed
        leftWidth="!xs-85 !s-80 !m-320px !l-320px !xl-320px"
        leftRelative="m l xl"
        leftResizable="m l xl"
        leftResizableMinWidth={220}
        leftResizableMaxWidth={500}
        isLeftOpen="m l xl"
        showLeftToggleButton
        top={<Plus4U5.App.TopBt displayedLanguages={library.languages} />}
        left={
          <Plus4U5.App.Left
            logoProps={{
              colorSchema: library.colorSchema,
              textColor: "#fff",
              subtitle: "library",
              title: <UU5.Bricks.Lsi lsi={library.name} />,
              decorationWidth: 136,
              decorationRight: -8,
              decorationBottom: -8,
              companyLogo: "https://cdn.plus4u.net/uu-plus4u5g01/4.0.0/assets/img/unicorn-logo.svg"
            }}
            aboutItems={[
              {
                content: "About application",
                href: "about"
              }
            ]}
            helpHref="https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-4a9622a0b4074996944c5d1fb07b22a7"
          >
            <Plus4U5.App.MenuProvider>
              <Plus4U5.App.MenuPanel header="Menu" expanded borderBottom>
                <Plus4U5.App.MenuTree items={menuItems} />
              </Plus4U5.App.MenuPanel>
            </Plus4U5.App.MenuProvider>
          </Plus4U5.App.Left>
        }
        menuProps={
          permissions.includes("Administrators") || permissions.includes("Managers")
            ? {
                header: "Control Bar",
                items: executiveItems
              }
            : null
        }
      >
        {this._getpermissions}
        {this._getLibrary()}
        <UU5.Common.Router
          routes={{
            "": "home",
            home: { component: <Home identity={this.props.identity} /> },
            about: { component: <About identity={this.props.identity} /> },
            location: { component: <Location /> },
            book: { component: <Book /> }
          }}
          controlled={false}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaNotAuthenticated;
