(function (window, document, angular, undefined) {

  // <input id='import-file-dialog' type='file' accept='.gz' />
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
  RequelPro.value('Mousetrap', window.Mousetrap);

  RequelPro.config(['$logProvider', function ($logProvider) {
    console.debug('Begin RequelPro.config()');

    $logProvider.debugEnabled(true);

    console.debug('End RequelPro.config()');
  }]);

  RequelPro.run(['$log', '$rootScope', 'gui', 'win', '$timeout', 'Mousetrap', function ($log, $rootScope, gui, win, $timeout, Mousetrap) {
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
      } catch (err) {
        $log.error(err);
        $log.error('Failed to load favorites!');
      }
      return favorites;
    }

    function Menu() {
      var menu = new gui.Menu();

      var cut = new gui.MenuItem({
        label: 'Cut\t\t\t\u2318X',
        click: function () {
          document.execCommand('cut');
        }
      });

      var copy = new gui.MenuItem({
        label: 'Copy\t\t\u2318C',
        click: function () {
          document.execCommand('copy');
        }
      });

      var paste = new gui.MenuItem({
        label: 'Paste\t\t\u2318V',
        click: function () {
          document.execCommand('paste');
        }
      });

      var deleteOption = new gui.MenuItem({
        label: 'Delete\t\t\u232b',
        click: function () {
          document.execCommand('delete');
        }
      });

      var selectAll = new gui.MenuItem({
        label: 'Select All\t\t\u2318A',
        click: function () {
          document.execCommand('selectAll');
        }
      });

      menu.append(cut);
      menu.append(copy);
      menu.append(paste);
      menu.append(deleteOption);
      menu.append(selectAll);

      return menu;
    }

    var menu = new Menu();
    $(document).on('contextmenu', function (e) {
      e.preventDefault();
      menu.popup(e.originalEvent.x, e.originalEvent.y);
    });

    var editKey = 'ctrl';
    if (process.platform === 'darwin') {
      editKey = 'command';
    }

    Mousetrap.bindGlobal(editKey + '+a', function () {
      document.execCommand('selectAll');
    });

    Mousetrap.bindGlobal(editKey + '+x', function () {
      document.execCommand('cut');
    });

    Mousetrap.bindGlobal(editKey + '+c', function () {
      document.execCommand('copy');
    });

    Mousetrap.bindGlobal(editKey + '+v', function () {
      document.execCommand('paste');
    });

    $rootScope.favorites = loadFavorites();

    $timeout(function () {
      $log.debug('Show window');
      gui.Window.get().show();

//      RequelPro.value('R', require(process.cwd() + '/server/index.js'));
    }, 0);

    $log.debug('End RequelPro.run()');
  }]);

})(window, window.document, window.angular);
