//import sweetalert from 'sweetalert';
//import r from 'rethinkdb';
//import path from 'path';
//import mout from 'mout';

//try {
// styles
import normalize from 'normalize.css';
import fontawesome from 'font-awesome-webpack';
import styles from './app.scss';

// libs
import gui from 'nw.gui';
import React from 'react';
import Router from 'react-router';

// routes
import Connect from './routes/connect/connect.jsx';

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

  render: function () {
    let activeTab = this.context.router.getCurrentParams().tab;
    return (
      <div>
        <div className="content">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

let routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Connect} />
  </Route>
);

//var RequelPro = angular.module('RequelPro', [
//  'ui.router',
//  'templates-app',
//  'angular-data.DSCacheFactory',
//  'js-data',
//  'toaster',
//  'mgcrea.ngStrap',
//  'ngAnimate',
//  'ngSanitize'
//]);
//
//RequelPro.value('gui', gui);
//RequelPro.value('win', win);
//RequelPro.value('mout', require('mout'));
//RequelPro.value('process', window.process);
//RequelPro.value('path', require('path'));
//RequelPro.value('NeDB', {});
//RequelPro.value('r', require('rethinkdb'));
//
//RequelPro.config(function ($logProvider, $stateProvider) {
//  console.log('Begin RequelPro.config()');
//
//  try {
//    $logProvider.debugEnabled(true);
//
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
//
//  console.log('End RequelPro.config()');
//});

//RequelPro.run(function ($log, $rootScope, win, gui, $timeout, contextMenu, mainMenu, $state, DS, DSNeDBAdapter, Connection) {
//  $log.debug('Begin RequelPro.run()');
//
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
//  $timeout(function () {
setTimeout(function () {
  console.log('Show window');
  win.show();
  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('mainView'));
  });

}, 200);
//      $state.go('new');
//    }, 200);
//
//    $log.debug('End RequelPro.run()');
//  });
//} catch
//  (err) {
//  console.error(err);
//}
