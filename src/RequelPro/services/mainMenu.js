/**
 ⌘ – \u2318 – the Command Key symbol
 ⌥ – \u2325 – the Option Key symbol
 ⇧ – \u21E7 – the Shift Key symbol
 ⎋ – \u238B – the ESC Key symbol
 ⇪ – \u21ea – the Capslock symbol
 ⏎ – \u23ce – the Return symbol
 ⌫ – \u232b – the Delete / Backspace symbol
 */
import gui from 'nw.gui';
let win = gui.Window.get();

function createFileMenu(rootMenu, position) {

  function chooseFile(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener('change', function () {
      console.log(this.value);
    }, false);

    chooser.click();
  }

  var FileMenu = new gui.MenuItem({
    type: 'normal',
    label: 'File'
  });
  FileMenu.submenu = new gui.Menu();

  FileMenu.submenu.append(new gui.MenuItem({
    label: 'New Connection Window',
    click: function () {
      gui.Window.get(window.open(window.location.href));
    },
    key: 'n',
    modifiers: 'cmd'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'New Connection Tab',
    click: function () {
      setTimeout(function () {
        //$state.go('new');
      });
    },
    key: 't',
    modifiers: 'cmd'
  }));
  FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Open...',
    click: function () {
      setTimeout(function () {
        console.log('open');
      });
    },
    key: 'o',
    modifiers: 'cmd'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Open Recent',
    click: function () {
      setTimeout(function () {
        console.log('openRecent');
      });
    }
  }));
  FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Import...',
    click: function () {
      chooseFile('#import-file-dialog');
      setTimeout(function () {
        console.log('import');
      });
    },
    key: 'i',
    modifiers: 'cmd-shift'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Export...',
    click: function () {
      setTimeout(function () {
        console.log('export');
      });
    },
    key: 'e',
    modifiers: 'cmd-shift'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    type: 'separator'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Close Window',
    click: function () {
      setTimeout(function () {
        console.log('$destroy');
        win.close();
      });
    },
    key: 'w',
    modifiers: 'cmd-shift'
  }));
  FileMenu.submenu.append(new gui.MenuItem({
    label: 'Close Tab',
    click: function () {
      setTimeout(function () {
        console.log('closeTab');
      });
    },
    key: 'w',
    modifiers: 'cmd-shift'
  }));

  rootMenu.insert(FileMenu, position);
}

function createEditMenu(rootMenu, position) {
  var EditMenu = rootMenu.items[position];
  var items = EditMenu.submenu.items;
  items[0].click = function () {
    document.execCommand('undo');
  };
  items[0].key = 'z';
  items[0].modifiers = 'cmd';
  items[1].click = function () {
    document.execCommand('redo');
  };
  items[1].key = 'z';
  items[1].modifiers = 'cmd-shift';
  items[3].click = function () {
    document.execCommand('cut');
  };
  items[3].key = 'x';
  items[3].modifiers = 'cmd';
  items[4].click = function () {
    document.execCommand('copy');
  };
  items[4].key = 'c';
  items[4].modifiers = 'cmd';
  items[5].click = function () {
    document.execCommand('paste');
  };
  items[5].key = 'v';
  items[5].modifiers = 'cmd';
}

function createViewMenu(rootMenu, position) {
  var ViewMenu = new gui.MenuItem({
    type: 'normal',
    label: 'View'
  });
  ViewMenu.submenu = new gui.Menu();
  ViewMenu.submenu.append(new gui.MenuItem({
    label: 'Test click view',
    click: function () {
      console.log('Test click view');
    }
  }));
  rootMenu.insert(ViewMenu, position);
}

function createDatabaseMenu(rootMenu, position) {
  var DatabaseMenu = new gui.MenuItem({
    type: 'normal',
    label: 'Database'
  });
  DatabaseMenu.submenu = new gui.Menu();
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Create Database...',
    click: function () {
      setTimeout(function () {
        console.log('createDatabase');
      });
    },
    key: 'a',
    modifiers: 'shift-alt'
  }));
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Drop Database...',
    click: function () {
      //if ($rootScope.connection) {
      //  $rootScope.processing = true;
      //  $rootScope.connection.dropDatabase($rootScope.connection.db)
      //    .then(function () {
      //      delete $rootScope.connection.db;
      //    })
      //    .finally(function () {
      //      $rootScope.processing = false;
      //    })
      //    .catch(function (err) {
      //      $rootScope.showError('Failed to drop database!', err.msg || err);
      //    })
      //    .error(function (err) {
      //      $rootScope.showError('Failed to drop database!', err.msg || err);
      //    });
      //}
    }
  }));
  DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Rename Database...',
    click: function () {
      setTimeout(function () {
        console.log('renameDatabase');
      });
    }
  }));
  DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Refresh Tables',
    click: function () {
      setTimeout(function () {
        console.log('refreshTables');
      });
    },
    key: 'r',
    modifiers: 'ctrl-cmd'
  }));
  DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Refresh Databases',
    click: function () {
      setTimeout(function () {
        console.log('refreshDatabases');
      });
    },
    key: 'r',
    modifiers: 'shift-cmd'
  }));
  DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  DatabaseMenu.submenu.append(new gui.MenuItem({
    label: 'Open Database in New Tab',
    click: function () {
      setTimeout(function () {
        console.log('openDatabaseInNewTab');
      });
    }
  }));
  rootMenu.insert(DatabaseMenu, position);
}

function createTableMenu(rootMenu, position) {
  var TableMenu = new gui.MenuItem({
    type: 'normal',
    label: 'Table'
  });
  TableMenu.submenu = new gui.Menu();
  TableMenu.submenu.append(new gui.MenuItem({
    label: 'Create Table...',
    click: function () {
      setTimeout(function () {
        console.log('createTable');
      });
    }
  }));
  TableMenu.submenu.append(new gui.MenuItem({
    label: 'Drop Table...',
    click: function () {
      setTimeout(function () {
        console.log('dropTable');
      });
    }
  }));
  TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  TableMenu.submenu.append(new gui.MenuItem({
    label: 'Empty Table...',
    click: function () {
      setTimeout(function () {
        console.log('emptyTable');
      });
    }
  }));
  TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
  TableMenu.submenu.append(new gui.MenuItem({
    label: 'Create Index...',
    click: function () {
      setTimeout(function () {
        console.log('createIndex');
      });
    }
  }));
  TableMenu.submenu.append(new gui.MenuItem({
    label: 'Drop Index...',
    click: function () {
      setTimeout(function () {
        console.log('dropIndex');
      });
    }
  }));

  rootMenu.insert(TableMenu, position);
}

function createHelpMenu(rootMenu) {
  var HelpMenu = new gui.MenuItem({
    type: 'normal',
    label: 'Help'
  });
  HelpMenu.submenu = new gui.Menu();
  HelpMenu.submenu.append(new gui.MenuItem({
    label: 'Online Help',
    click: function () {
      console.log('Online Help');
    }
  }));

  rootMenu.append(HelpMenu);
}

try {
  console.log('creating main menu');
  let mainMenu = new gui.Menu({ type: 'menubar' });

  mainMenu.createMacBuiltin('Requel Pro');
  win.menu = mainMenu;

  createFileMenu(mainMenu, 1);
  createEditMenu(mainMenu, 2);
  createViewMenu(mainMenu, 3);
  createDatabaseMenu(mainMenu, 4);
  createTableMenu(mainMenu, 5);
  createHelpMenu(mainMenu);

  win.menu.items[1].submenu.items[6].enabled = false;
  win.menu.items[1].submenu.items[7].enabled = false;

  //$rootScope.$watch('connection', function (connection) {
  //  win.menu.items[1].submenu.items[6].enabled = !!connection;
  //  win.menu.items[1].submenu.items[7].enabled = !!connection;
  //});

  //$rootScope.$watch('connection.db', function (db) {
  //  win.menu.items[3].submenu.items[1].enabled = !!db;
  //  win.menu.items[3].submenu.items[3].enabled = !!db;
  //  win.menu.items[3].submenu.items[5].enabled = !!db;
  //  win.menu.items[3].submenu.items[9].enabled = !!db;
  //  win.menu.items[4].submenu.items[0].enabled = !!db;
  //});
  //
  //$rootScope.$watch('connection.table', function (table) {
  //  win.menu.items[4].submenu.items[1].enabled = !!table;
  //  win.menu.items[4].submenu.items[3].enabled = !!table;
  //  win.menu.items[4].submenu.items[5].enabled = !!table;
  //  win.menu.items[4].submenu.items[6].enabled = !!table;
  //});
} catch (err) {
  console.error(err);
}
