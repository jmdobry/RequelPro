try {
  var gui = require('nw.gui');
  var win = gui.Window.get();

  win.showDevTools();

  win.y = window.screen.availTop;
  win.x = window.screen.availLeft;
  win.height = window.screen.availHeight;
  win.width = window.screen.availWidth;

  var RequelPro = angular.module('RequelPro', ['ui.router']);

  RequelPro.value('gui', gui);
  RequelPro.value('win', win);
  RequelPro.value('process', window.process);
  RequelPro.value('Mousetrap', window.Mousetrap);

  RequelPro.config(['$logProvider', function ($logProvider) {
    console.log('Begin RequelPro.config()');

    $logProvider.debugEnabled(true);

    console.log('End RequelPro.config()');
  }]);

  RequelPro.run(['$log', '$rootScope', 'win', '$timeout', 'contextMenu', function ($log, $rootScope, win, $timeout) {
    $log.debug('Begin RequelPro.run()');

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
  }]);
} catch (err) {
  console.error(err);
}
