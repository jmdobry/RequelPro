try {
  var gui = require('nw.gui');
  var win = gui.Window.get();

  win.showDevTools();

  win.y = window.screen.availTop;
  win.x = window.screen.availLeft;
  win.height = window.screen.availHeight;
  win.width = window.screen.availWidth;

  var RequelPro = angular.module('RequelPro', ['ui.router', 'templates-app', 'angular-data.DSCacheFactory', 'angular-data.DS']);

  RequelPro.value('gui', gui);
  RequelPro.value('win', win);
  RequelPro.value('process', window.process);
  RequelPro.value('path', require('path'));
  RequelPro.value('Mousetrap', window.Mousetrap);

  RequelPro.config(['$logProvider', '$stateProvider', function ($logProvider, $stateProvider) {
    console.log('Begin RequelPro.config()');

    $logProvider.debugEnabled(true);

    try {
      $stateProvider
        .state('new', {
          url: '/new',
          templateUrl: 'connect/controllers/connectPage.html',
          controller: 'ConnectController',
          controllerAs: 'ConnectCtrl'
        })
        .state('content', {
          url: '/content/:id',
          templateUrl: 'content/controllers/contentPage.html',
          controllerAs: 'ContentCtrl',
          controller: 'ContentController'
        });

    } catch (err) {
      console.error(err);
    }

    console.log('End RequelPro.config()');
  }]);

  RequelPro.value('NeDB', {});

  RequelPro.run(['$log', '$rootScope', 'win', 'gui', '$timeout', 'contextMenu', '$state', 'DS', 'path', 'NeDB',
    function ($log, $rootScope, win, gui, $timeout, contextMenu, $state, DS, path, NeDB) {
      $log.debug('Begin RequelPro.run()');

      $state.go('new');

      var Datastore = require('nedb');
      var datapath = gui.App.dataPath + '/nedb';

      NeDB.connection = new Datastore({
        filename: path.join(datapath, 'connection.db'),
        autoload: true,
        error: function (err) {
          $log.error(err);
        }
      });
      DS.defineResource('connection', {
        idAttribute: '_id',
        afterCreate: function (resourceName, attrs, cb) {
          $log.debug('create', resourceName, attrs);
          cb(null, attrs);
        }
      });

      function loadFavorites() {
        var favorites = [];
        try {
          var f = localStorage.getItem('favorites');
          if (f) {
            favorites = JSON.parse(f);
          } else {
            localStorage.setItem('favorites', favorites);
          }
          $log.debug('Loaded favorites: ', favorites);
        } catch (err) {
          $log.error(err);
          $log.error('Failed to load favorites!');
        }
        return favorites;
      }

      $rootScope.favorites = loadFavorites();

      $timeout(function () {
        $log.debug('Show window');
        win.show();

        RequelPro.value('R', require(process.cwd() + '/server/index.js'));
      }, 500);

      $log.debug('End RequelPro.run()');
    }
  ])
  ;
} catch
  (err) {
  console.error(err);
}
