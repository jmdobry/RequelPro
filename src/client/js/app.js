try {
  var gui = require('nw.gui');
  var win = gui.Window.get();

  win.showDevTools();

  win.y = window.screen.availTop;
  win.x = window.screen.availLeft;
  win.height = window.screen.availHeight;
  win.width = window.screen.availWidth;

  var RequelPro = angular.module('RequelPro', ['ui.router', 'templates-app', 'angular-data.DSCacheFactory', 'angular-data.DS', 'mgcrea.ngStrap', 'ngAnimate', 'ngSanitize']);

  RequelPro.value('gui', gui);
  RequelPro.value('win', win);
  RequelPro.value('mout', require('mout'));
  RequelPro.value('process', window.process);
  RequelPro.value('path', require('path'));
  RequelPro.value('Mousetrap', window.Mousetrap);
  RequelPro.value('NeDB', {});
  RequelPro.value('r', require('rethinkdb'));

  RequelPro.config(['$logProvider', '$stateProvider', 'DSProvider', function ($logProvider, $stateProvider, DSProvider) {
    console.log('Begin RequelPro.config()');

    $logProvider.debugEnabled(true);

    DSProvider.defaults.defaultAdapter = 'DSNeDBAdapter';
    DSProvider.defaults.deserialize = function (resourceName, data) {
      console.debug('\tdeserialize()', resourceName, data);
      if (data && data.data) {
        return data.data;
      } else {
        return data;
      }
    };

    try {
      $stateProvider
        .state('new', {
          url: '/new',
          templateUrl: 'connect/controllers/connectPage.html',
          controller: 'ConnectController',
          controllerAs: 'ConnectCtrl',
          resolve: {
            favorites: ['DS', function (DS) {
              return DS.findAll('favorite');
            }]
          }
        })
        .state('content', {
          url: '/content/:id',
          templateUrl: 'content/controllers/contentPage.html',
          controllerAs: 'ContentCtrl',
          controller: 'ContentController',
          resolve: {
            connection: ['DS', '$stateParams', '$rootScope', function (DS, $stateParams, $rootScope) {
              return DS.find('connection', $stateParams.id).then(function (connection) {
                $rootScope.connection = connection;
                return connection;
              });
            }]
          }
        });

    } catch (err) {
      console.error(err);
    }

    console.log('End RequelPro.config()');
  }]);

  RequelPro.run(['$log', '$rootScope', 'win', 'gui', '$timeout', 'contextMenu', 'mainMenu', '$state', 'DS', 'DSNeDBAdapter', 'path', 'NeDB',
    function ($log, $rootScope, win, gui, $timeout, contextMenu, mainMenu, $state, DS, DSNeDBAdapter, path, NeDB) {
      $log.debug('Begin RequelPro.run()');

      DS.adapters.DSNeDBAdapter = DSNeDBAdapter;

      var Datastore = require('nedb');
      var datapath = gui.App.dataPath + '/nedb';

      $log.debug('nedb datapath:', datapath);

      NeDB.favorite = new Datastore({
        filename: path.join(datapath, 'favorite.db'),
        autoload: true,
        error: function (err) {
          $log.error(err);
        }
      });
      DS.defineResource({
        name: 'favorite',
        methods: {}
      });
      DS.defineResource({
        name: 'connection',
        methods: require(process.cwd() + '/server/models/Connection.js')
      });

      DS.bindAll($rootScope, 'connections', 'connection', {});

      $timeout(function () {
        $state.go('new');
      }, 100);

      $timeout(function () {
        $log.debug('Show window');
        win.show();
      }, 500);

      $log.debug('End RequelPro.run()');
    }
  ]);
} catch
  (err) {
  console.error(err);
}
