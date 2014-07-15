/**
 ⌘ – \u2318 – the Command Key symbol
 ⌥ – \u2325 – the Option Key symbol
 ⇧ – \u21E7 – the Shift Key symbol
 ⎋ – \u238B – the ESC Key symbol
 ⇪ – \u21ea – the Capslock symbol
 ⏎ – \u23ce – the Return symbol
 ⌫ – \u232b – the Delete / Backspace symbol
 */
(function () {
  function createFileMenu(gui, rootMenu, position) {
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
    var fileSubmenu = new gui.Menu()
    if (process.platform !== 'win32') {
      rootMenu.insert(FileMenu, position);
      FileMenu.submenu = fileSubmenu;
    }
    var fileSubmenuItems = {
      newConnectionWindow: new gui.MenuItem({
        label: 'New Connection Window',
        click: function () {
          gui.Window.get(window.open(window.location.href));
        }
      }),
      newConnectionTab: new gui.MenuItem({
        label: 'New Connection Tab',
        click: function () {
          console.log('New Connection Tab');
        }
      }),
      open: new gui.MenuItem({
        label: 'Open...',
        click: function () {
          console.log('Open...');
        }
      }),
      openRecent: new gui.MenuItem({
        label: 'Open Recent',
        click: function () {
          console.log('Open Recent');
        }
      }),
      import: new gui.MenuItem({
        label: 'Import...',
        click: function () {
          console.log('Import data');
          chooseFile('#import-file-dialog');
        }
      }),
      export: new gui.MenuItem({
        label: 'Export...',
        click: function () {
          console.log('Export data');
        }
      }),
      closeWindow: new gui.MenuItem({
        label: 'Close Window',
        click: function () {
          console.log('Import data');
        }
      }),
      closeTab: new gui.MenuItem({
        label: 'Close Tab',
        click: function () {
          console.log('Export data');
        }
      })
    };

    fileSubmenu.append(fileSubmenuItems.newConnectionWindow);
    fileSubmenu.append(fileSubmenuItems.newConnectionTab);
    fileSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    fileSubmenu.append(fileSubmenuItems.open);
    fileSubmenu.append(fileSubmenuItems.openRecent);
    fileSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    fileSubmenu.append(fileSubmenuItems.import);
    fileSubmenu.append(fileSubmenuItems.export);
    fileSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    fileSubmenu.append(fileSubmenuItems.closeWindow);
    fileSubmenu.append(fileSubmenuItems.closeTab);

    if (process.platform === 'win32') {
      FileMenu.submenu = fileSubmenu;
      rootMenu.append(FileMenu);
    }
  }

  function createEditMenu(gui, rootMenu, position) {
    var EditMenu = new gui.MenuItem({
      type: 'normal',
      label: 'Edit'
    });
    rootMenu.insert(EditMenu, position);
    rootMenu.items[position - 1].submenu = new gui.Menu();
    var editSubmenu = rootMenu.items[position - 1].submenu;
    var editSubmenuItems = {
      undo: new gui.MenuItem({
        label: 'Undo\t\t\u2318Z',
        click: function () {
          document.execCommand('undo');
        }
      }),
      redo: new gui.MenuItem({
        label: 'Redo\t\t\u21E7\u2318Z',
        click: function () {
          document.execCommand('redo');
        }
      }),
      cut: new gui.MenuItem({
        label: 'Cut\t\t\t\u2318X',
        click: function () {
          document.execCommand('cut');
        }
      }),
      copy: new gui.MenuItem({
        label: 'Copy\t\t\u2318C',
        click: function () {
          document.execCommand('copy');
        }
      }),
      paste: new gui.MenuItem({
        label: 'Paste\t\t\u2318V',
        click: function () {
          document.execCommand('paste');
        }
      })
    };
    editSubmenu.append(editSubmenuItems.undo);
    editSubmenu.append(editSubmenuItems.redo);
    editSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    editSubmenu.append(editSubmenuItems.cut);
    editSubmenu.append(editSubmenuItems.copy);
    editSubmenu.append(editSubmenuItems.paste);
  }

  function createViewMenu(gui, rootMenu, position) {
    var ViewMenu = new gui.MenuItem({
      type: 'normal',
      label: 'View'
    });
    rootMenu.insert(ViewMenu, position);
    rootMenu.items[position - 1].submenu = new gui.Menu();
    var viewSubmenu = rootMenu.items[position - 1].submenu;
    var viewSubmenuItems = {
      test: new gui.MenuItem({
        label: 'Test click view',
        click: function () {
          console.log('Test click view');
        }
      })
    };
    viewSubmenu.append(viewSubmenuItems.test);
  }

  function createDatabaseMenu(gui, rootMenu, position) {
    var DatabaseMenu = new gui.MenuItem({
      type: 'normal',
      label: 'Database'
    });
    rootMenu.insert(DatabaseMenu, position);
    rootMenu.items[position - 1].submenu = new gui.Menu();
    var databaseSubmenu = rootMenu.items[position - 1].submenu;
    var databaseSubmenuItems = {
      createDatabase: new gui.MenuItem({
        label: 'Create Database...',
        click: function () {
          console.log('createDatabase');
        }
      }),
      dropDatabase: new gui.MenuItem({
        label: 'Drop Database...',
        click: function () {
          console.log('dropDatabase');
        }
      }),
      renameDatabase: new gui.MenuItem({
        label: 'Rename Database...',
        click: function () {
          console.log('renameDatabase');
        }
      }),
      refreshTables: new gui.MenuItem({
        label: 'Refresh Tables',
        click: function () {
          console.log('refreshTables');
        }
      }),
      refreshDatabases: new gui.MenuItem({
        label: 'Refresh Databases',
        click: function () {
          console.log('refreshDatabases');
        }
      }),
      openDatabaseInNewTab: new gui.MenuItem({
        label: 'Open Database in New Tab',
        click: function () {
          console.log('openDatabaseInNewTab');
        }
      })
    };

    databaseSubmenu.append(databaseSubmenuItems.createDatabase);
    databaseSubmenu.append(databaseSubmenuItems.dropDatabase);
    databaseSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    databaseSubmenu.append(databaseSubmenuItems.renameDatabase);
    databaseSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    databaseSubmenu.append(databaseSubmenuItems.refreshTables);
    databaseSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    databaseSubmenu.append(databaseSubmenuItems.refreshDatabases);
    databaseSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    databaseSubmenu.append(databaseSubmenuItems.openDatabaseInNewTab);
  }

  function createTableMenu(gui, rootMenu, position) {
    var TableMenu = new gui.MenuItem({
      type: 'normal',
      label: 'Table'
    });
    rootMenu.insert(TableMenu, position);
    rootMenu.items[position - 1].submenu = new gui.Menu();
    var tableSubmenu = rootMenu.items[position - 1].submenu;
    var tableSubmenuItems = {
      createTable: new gui.MenuItem({
        label: 'Create Table...',
        click: function () {
          console.log('createTable');
          console.log(process.version);
        }
      }),
      dropTable: new gui.MenuItem({
        label: 'Drop Table...',
        click: function () {
          console.log('dropTable');
        }
      }),
      emptyTable: new gui.MenuItem({
        label: 'Empty Table...',
        click: function () {
          console.log('emptyTable');
        }
      }),
      createIndex: new gui.MenuItem({
        label: 'Create Index...',
        click: function () {
          console.log('createIndex');
        }
      }),
      dropIndex: new gui.MenuItem({
        label: 'Drop Index...',
        click: function () {
          console.log('dropIndex');
        }
      })
    };

    tableSubmenu.append(tableSubmenuItems.createTable);
    tableSubmenu.append(tableSubmenuItems.dropTable);
    tableSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    tableSubmenu.append(tableSubmenuItems.emptyTable);
    tableSubmenu.append(new gui.MenuItem({
      type: 'separator'
    }));
    tableSubmenu.append(tableSubmenuItems.createIndex);
    tableSubmenu.append(tableSubmenuItems.dropIndex);
  }

  function createHelpMenu(gui, rootMenu) {
    var HelpMenu = new gui.MenuItem({
      type: 'normal',
      label: 'Help'
    });
    rootMenu.append(HelpMenu);
    rootMenu.items[rootMenu.items.length - 1].submenu = new gui.Menu();
    var helpSubmenu = rootMenu.items[rootMenu.items.length - 1].submenu;
    var helpSubmenuItems = {
      onlineHelp: new gui.MenuItem({
        label: 'Online Help',
        click: function () {
          console.log('Online Help');
        }
      })
    };

    helpSubmenu.append(helpSubmenuItems.onlineHelp);
  }

  try {
    console.log('creating main menu');
    var gui = require('nw.gui');
    var win = gui.Window.get();
    var mainMenu = new gui.Menu({
      type: 'menubar'
    });

    if (process.platform !== 'win32') {
      win.menu = mainMenu;
    }

    createFileMenu(gui, mainMenu, 1);
    // createEditMenu(gui, mainMenu, 2);
    // createViewMenu(gui, mainMenu, 3);
    // createDatabaseMenu(gui, mainMenu, 4);
    // createTableMenu(gui, mainMenu, 5);
    // createHelpMenu(gui, mainMenu);

    if (process.platform === 'win32') {
      win.menu = mainMenu;
    }
  } catch (err) {
    console.error(err);
  }
})();
