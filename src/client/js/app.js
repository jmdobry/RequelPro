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

    try {
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

      $stateProvider
        .state('new', {
          url: '/',
          templateUrl: 'connect/controllers/connectPage.html',
          controller: 'ConnectController',
          controllerAs: 'ConnectCtrl',
          resolve: {
            favorites: ['Favorite', function (Favorite) {
              return Favorite.findAll();
            }]
          }
        })
        .state('content', {
          url: '/content/:id',
          templateUrl: 'content/controllers/contentPage.html',
          controllerAs: 'ContentCtrl',
          controller: 'ContentController',
          resolve: {
            connection: ['Connection', '$stateParams', '$rootScope', function (Connection, $stateParams, $rootScope) {
              $rootScope.connection = Connection.get($stateParams.id);
              return $rootScope.connection;
            }]
          }
        });
    } catch (err) {
      console.error(err);
    }

    console.log('End RequelPro.config()');
  }]);

  RequelPro.run(['$log', '$rootScope', 'win', 'gui', '$timeout', 'contextMenu', 'mainMenu', '$state', 'DS', 'DSNeDBAdapter', 'Connection',
    function ($log, $rootScope, win, gui, $timeout, contextMenu, mainMenu, $state, DS, DSNeDBAdapter, Connection) {
      $log.debug('Begin RequelPro.run()');

      DS.adapters.DSNeDBAdapter = DSNeDBAdapter;

      Connection.bindAll($rootScope, 'connections', {});

      $timeout(function () {
        $log.debug('Show window');
        win.show();
        $state.go('new');
      }, 200);

      $log.debug('End RequelPro.run()');
    }
  ]);
} catch
  (err) {
  console.error(err);
}
