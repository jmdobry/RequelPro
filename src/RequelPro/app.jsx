// styles
import fontawesome from 'font-awesome-webpack';
import appStyles from './app.scss';

// libs
import gui from 'nw.gui';
import React from 'react';
import Router from 'react-router';

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

// models
import Connection from './models/connection.js';
import Favorite from './models/favorite.js';

// components
import Databases from './components/databases/databases.jsx';
import Navbar from './components/navbar/navbar.jsx';
import Navtabs from './components/navtabs/navtabs.jsx';

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
    Connection.on('newTab', this.onNewTab);
  },
  componentWillUnmount() {
    Connection.off('newTab', this.onNewTab);
  },
  /*
   * Event Handlers
   */
  onNewTab() {
    Connection.unset();
    this.context.router.transitionTo('/');
  },
  onLinkClick() {
    if (!this.state.connection) {
      return false;
    }
  },
  /*
   * Methods
   */
  render() {
    return (
      <div className="content">
        <div id="headerRow" className="row">
          <div className="columns large-3 medium-4">
            <Databases/>
          </div>
          <div className="columns large-9 medium-8 end">
            <Navbar/>
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

let routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Connect} />
    <Route name="structure" path="/structure/:id" handler={Structure} />
    <Route name="content" path="/content/:id" handler={Content} />
    <Route name="relations" path="/relations/:id" handler={Relations} />
    <Route name="info" path="/info/:id" handler={Info} />
    <Route name="query" path="/query/:id" handler={Query} />
  </Route>
);

setTimeout(() => {
  win.show();
  Router.run(routes, Handler => {
    React.render(<Handler/>, document.getElementById('mainView'));
  });
}, 200);
