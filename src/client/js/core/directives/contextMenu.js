angular.module('RequelPro').factory('contextMenu', function (gui, process, $document) {
  function Menu() {
    var menu = new gui.Menu();

    var cut = new gui.MenuItem({
      label: 'Cut',
      click: function () {
        document.execCommand('cut');
      },
      key: 'x',
      modifiers: 'cmd'
    });

    var copy = new gui.MenuItem({
      label: 'Copy',
      click: function () {
        document.execCommand('copy');
      },
      key: 'c',
      modifiers: 'cmd'
    });

    var paste = new gui.MenuItem({
      label: 'Paste\t\t\u2318V',
      click: function () {
        document.execCommand('paste');
      },
      key: 'c',
      modifiers: 'cmd'
    });

    var selectAll = new gui.MenuItem({
      label: 'Select All',
      click: function () {
        document.execCommand('selectAll');
      },
      key: 'a',
      modifiers: 'cmd'
    });

    menu.append(cut);
    menu.append(copy);
    menu.append(paste);
    menu.append(selectAll);

    return menu;
  }

  var menu = new Menu();

  $($document).on('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(e.originalEvent.x, e.originalEvent.y);
  });

  return Menu;
});
