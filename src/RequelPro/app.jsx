//import sweetalert from 'sweetalert';
//import r from 'rethinkdb';
//import path from 'path';
//import mout from 'mout';

// styles
import fontawesome from 'font-awesome-webpack';
import styles from './app.scss';

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

// services
import MainMenu from './services/mainMenu.js';
import ContextMenu from './services/contextMenu.js';

// models
import Connection from './models/connection.js';
import Favorite from './models/favorite.js';

let { Route, DefaultRoute, RouteHandler, Link } = Router;

let win = gui.Window.get();

win.showDevTools();

win.y = window.screen.availTop;
win.x = window.screen.availLeft;
win.height = window.screen.availHeight;
win.width = window.screen.availWidth;

let App = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { id: 1, connection: Connection.current() };
  },

  onLinkClick() {
    if (!this.state.connection) {
      return false;
    }
  },

  render() {
    let activeTab = this.context.router.getCurrentParams().tab;
    let classes = classnames({
      item: true,
      disabled: !this.state.connection
    });
    return (
      <div>
        <div className="content">
          <div className="icon-bar five-up">
            <a className="item">
              <i className="fa fa-list"></i>
              <label>Databases</label>
            </a>
            <Link className={classes} to="structure" params={{ id: this.state.id }} onClick={this.onLinkClick}>
              <i className="fa fa-database"></i>
              <label>Structure</label>
            </Link>
            <Link className={classes} to="content" params={{ id: this.state.id }} onClick={this.onLinkClick}>
              <i className="fa fa-table"></i>
              <label>Content</label>
            </Link>
            <Link className={classes} to="relations" params={{ id: this.state.id }} onClick={this.onLinkClick}>
              <i className="fa fa-sitemap"></i>
              <label>Relations</label>
            </Link>
            <Link className={classes} to="info" params={{ id: this.state.id }} onClick={this.onLinkClick}>
              <i className="fa fa-info"></i>
              <label>Table Info</label>
            </Link>
          </div>
          <RouteHandler/>
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
  </Route>
);

//  try {
//    $stateProvider
//      .state('new', {
//        url: '/',
//        templateUrl: 'connect/controllers/connectPage.html',
//        controller: 'ConnectController',
//        controllerAs: 'ConnectCtrl',
//        resolve: {
//          favorites: ['Favorite', function (Favorite) {
//            return Favorite.findAll();
//          }]
//        }
//      })
//      .state('structure', {
//        url: '/structure/:id',
//        templateUrl: 'structure/controllers/structurePage.html',
//        controllerAs: 'StructureCtrl',
//        controller: 'StructureController',
//        resolve: {
//          connection: function (Connection, $stateParams, $rootScope) {
//            $rootScope.connection = Connection.get($stateParams.id);
//            return $rootScope.connection;
//          }
//        }
//      })
//      .state('content', {
//        url: '/content/:id',
//        templateUrl: 'content/controllers/contentPage.html',
//        controllerAs: 'ContentCtrl',
//        controller: 'ContentController',
//        resolve: {
//          connection: function (Connection, $stateParams, $rootScope) {
//            $rootScope.connection = Connection.get($stateParams.id);
//            return $rootScope.connection;
//          }
//        }
//      })
//      .state('relations', {
//        url: '/relations/:id',
//        templateUrl: 'relations/controllers/relationsPage.html',
//        controllerAs: 'RelationsCtrl',
//        controller: 'RelationsController',
//        resolve: {
//          connection: function (Connection, $stateParams, $rootScope) {
//            $rootScope.connection = Connection.get($stateParams.id);
//            return $rootScope.connection;
//          }
//        }
//      });
//  } catch (err) {
//    console.error(err);
//  }

//  DS.registerAdapter('nedb', DSNeDBAdapter, { default: true });
//
//  $rootScope.$watch(function () {
//    return Connection.lastModified();
//  }, function () {
//    $rootScope.connections = Connection.filter();
//  });
//
//  $rootScope.connections = [];
//  $rootScope.connection = null;
//
//  $rootScope.$watch(function () {
//    return $state.current.name;
//  }, function (name) {
//    $rootScope.state = name;
//  });
//
//  $rootScope.showError = function (title, msg) {
//    $log.error(title || 'error', msg || '');
//    sweetAlert({
//      type: 'error',
//      title: title || 'Error!',
//      text: msg || '',
//      confirmButtonColor: '#f65b4f',
//      confirmButtonText: 'Okay'
//    });
//  };
//
//  $rootScope.showSuccess = function (title, msg) {
//    sweetAlert({
//      type: 'success',
//      title: title || 'Success!',
//      text: msg || '',
//      confirmButtonColor: '#1fa589',
//      confirmButtonText: 'Okay'
//    });
//  };
//
//  $rootScope.navigate = function (state, params) {
//    $state.go(state, params);
//  };
//
setTimeout(() => {
  console.log('Show window');
  win.show();
  Router.run(routes, Handler => {
    React.render(<Handler/>, document.getElementById('mainView'));
  });

}, 200);
