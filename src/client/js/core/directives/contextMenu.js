angular.module('RequelPro').factory('contextMenu', ['gui', 'Mousetrap', 'process', '$document', '$log',
  function (gui, Mousetrap, process, $document, $log) {
    $log.debug('Being contextMenu factory definition');

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

    $($document).on('contextmenu', function (e) {
      $log.debug('Context menu activated');
      e.preventDefault();
      menu.popup(e.originalEvent.x, e.originalEvent.y);
    });

    var editKey = 'ctrl';
    if (process.platform === 'darwin') {
      editKey = 'command';
    }

    $log.debug('Setting "editKey" to "' + editKey + '"');

    Mousetrap.bindGlobal(editKey + '+a', function () {
      $log.debug('Hotkey: ' + editKey + '+a');
      document.execCommand('selectAll');
    });

    Mousetrap.bindGlobal(editKey + '+x', function () {
      $log.debug('Hotkey: ' + editKey + '+x');
      document.execCommand('cut');
    });

    Mousetrap.bindGlobal(editKey + '+c', function () {
      $log.debug('Hotkey: ' + editKey + '+c');
      document.execCommand('copy');
    });

    Mousetrap.bindGlobal(editKey + '+v', function () {
      $log.debug('Hotkey: ' + editKey + '+v');
      document.execCommand('paste');
    });

    $log.debug('Being contextMenu factory definition');

    return Menu;
  }
]);
