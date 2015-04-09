// styles
import fontawesome from 'font-awesome-webpack';
import appStyles from './app.scss';

// libs
import gui from 'nw.gui';
import React from 'react';
import Router from 'react-router';
import classnames from 'classnames';

// routes
import Connect from './routes/connect/connect.jsx';
import Structure from './routes/structure/structure.jsx';
import Content from './routes/content/content.jsx';
import Relations from './routes/relations/relations.jsx';
import Info from './routes/info/info.jsx';
import Query from './routes/query/query.jsx';

// services
import MainMenu from './services/mainMenu.js';
import ContextMenu from './services/contextMenu.js';
import layout from './services/layout.js';
import store from './services/store.js';

// models
import Connection from './models/connection.js';
import Database from './models/database.js';
import Table from './models/table.js';
import Favorite from './models/favorite.js';

// components
import Databases from './components/databases/databases.jsx';
import Navbar from './components/navbar/navbar.jsx';
import Clusterbar from './components/clusterbar/clusterbar.jsx';
import Navtabs from './components/navtabs/navtabs.jsx';
import Tables from './components/tables/tables.jsx';

let { Route, DefaultRoute, RouteHandler, Link } = Router;

let win = gui.Window.get();

win.showDevTools();

win.y = window.screen.availTop;
win.x = window.screen.availLeft;
win.height = window.screen.availHeight;
win.width = window.screen.availWidth;

let App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  componentDidMount() {
    // Event comes from main menu or global shortcut
    Connection.on('newTab', this.onNewTab);
    // Event comes from main menu or global shortcut
    store.on('goBack', this.context.router.goBack);
  },
  componentWillUnmount() {
    Connection.off('newTab', this.onNewTab);
    store.off('goBack', this.context.router.goBack);
  },
  componentWillReceiveProps() {
    store.emit('route', this.context.router.getCurrentParams(), this.context.router.getCurrentPathname());
  },
  /*
   * Event Handlers
   */
  onNewTab() {
    this.context.router.transitionTo('/');
  },
  onLinkClick() {
    if (!this.state.connection) {
      return false;
    }
  },
  onMenu(e) {
    e.preventDefault();
    ContextMenu.popup(e.clientX, e.clientY);
  },
  /*
   * Methods
   */
  render() {
    return (
      <div className="content" onContextMenu={this.onMenu}>
        <div id="headerRow" className="row">
          <div className="columns large-2 medium-3">
            <Databases/>
          </div>
          <div className="columns large-7 medium-5">
            <Navbar/>
          </div>
          <div className="columns large-3 medium-4 end">
            <Clusterbar/>
          </div>
        </div>
        <div id="tabsRow" className="row">
          <div className="columns medium-12">
            <Navtabs/>
          </div>
        </div>
        <div id="contentRow" className="row">
          <div className="columns medium-12">
            <RouteHandler/>
          </div>
        </div>
      </div>
    );
  }
});

let ConnectionView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return { connection: Connection.get(this.context.router.getCurrentParams().id) };
  },
  componentDidMount() {
    layout.maximize('#selectDatabase');
  },
  render() {
    return (
      <div id="selectDatabase">
        <div className="row">
          <div className="large-12 columns end">
          Select a database or create one to begin...
          </div>
        </div>
      </div>
    );
  }
});

let getData = params => {
  let database = null;
  if (params.databaseId) {
    database = Database.get(params.databaseId);
  }
  return { database };
};

let DatabaseView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return getData(this.context.router.getCurrentParams());
  },
  componentDidMount() {
    Table.on('change', this.onChange);
    layout.maximize('#selectTable');
  },
  componentWillUnmount() {
    Table.off('change', this.onChange);
    layout.maximize('#selectTable');
  },
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  render() {
    return (
      <div id="selectTable">
        <div className="row">
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
          Select a table to begin... - {this.state.database ? this.state.database.id : 'none selected'}
          </div>
        </div>
      </div>
    );
  }
});

let TableView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return { table: Table.get(this.context.router.getCurrentParams().tableId) };
  },
  componentDidMount() {
    layout.maximize('#tableView');
  },
  render() {
    return (
      <div id="tableView">
        <div className="row">
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
            <RouteHandler/>
          </div>
        </div>
      </div>
    );
  }
});

let routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Connect} />
    <Route name="connection" path="/connection/:id" handler={ConnectionView} />
    <Route name="database" path="/connection/:id/database/:databaseId" handler={DatabaseView} />
    <Route name="table" path="/connection/:id/database/:databaseId/table/:tableId" handler={TableView}>
      <Route name="structure" path="structure" handler={Structure} />
      <Route name="content" path="content" handler={Content} />
      <Route name="relations" path="relations" handler={Relations} />
      <Route name="info" path="info" handler={Info} />
      <Route name="query" path="query" handler={Query} />
    </Route>
  </Route>
);

setTimeout(() => {
  win.show();
  Router.run(routes, Handler => {
    React.render(<Handler/>, document.getElementById('mainView'));
  });
}, 200);
