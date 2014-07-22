/**
 ⌘ – \u2318 – the Command Key symbol
 ⌥ – \u2325 – the Option Key symbol
 ⇧ – \u21E7 – the Shift Key symbol
 ⎋ – \u238B – the ESC Key symbol
 ⇪ – \u21ea – the Capslock symbol
 ⏎ – \u23ce – the Return symbol
 ⌫ – \u232b – the Delete / Backspace symbol
 */
angular.module('RequelPro').factory('mainMenu', ['$rootScope', 'gui', 'win', 'Mousetrap', 'process', '$log', '$timeout', '$state',
  function ($rootScope, gui, win, Mousetrap, process, $log, $timeout, $state) {

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
      var fileSubmenu = new gui.Menu();
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
            $timeout(function () {
              $state.go('new');
            });
          }
        }),
        open: new gui.MenuItem({
          label: 'Open...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('open');
            });
          }
        }),
        openRecent: new gui.MenuItem({
          label: 'Open Recent',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('openRecent');
            });
          }
        }),
        import: new gui.MenuItem({
          label: 'Import...',
          click: function () {
            chooseFile('#import-file-dialog');
            $timeout(function () {
              $rootScope.$broadcast('import');
            });
          }
        }),
        export: new gui.MenuItem({
          label: 'Export...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('export');
            });
          }
        }),
        closeWindow: new gui.MenuItem({
          label: 'Close Window',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('$destroy');
              win.close();
            });
          }
        }),
        closeTab: new gui.MenuItem({
          label: 'Close Tab',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('closeTab');
            });
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

    function createEditMenu(rootMenu, position) {
      var EditMenu = new gui.MenuItem({
        type: 'normal',
        label: 'Edit'
      });
      var editSubmenu = new gui.Menu();
      if (process.platform !== 'win32') {
        rootMenu.insert(EditMenu, position);
        EditMenu.submenu = editSubmenu;
      }
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

      if (process.platform === 'win32') {
        EditMenu.submenu = editSubmenu;
        rootMenu.append(EditMenu);
      }
    }

    function createViewMenu(rootMenu, position) {
      var ViewMenu = new gui.MenuItem({
        type: 'normal',
        label: 'View'
      });
      var viewSubmenu = new gui.Menu();
      if (process.platform !== 'win32') {
        rootMenu.insert(ViewMenu, position);
        ViewMenu.submenu = viewSubmenu;
      }
      var viewSubmenuItems = {
        test: new gui.MenuItem({
          label: 'Test click view',
          click: function () {
            console.log('Test click view');
          }
        })
      };
      viewSubmenu.append(viewSubmenuItems.test);

      if (process.platform === 'win32') {
        ViewMenu.submenu = viewSubmenu;
        rootMenu.append(ViewMenu);
      }
    }

    function createDatabaseMenu(rootMenu, position) {
      var DatabaseMenu = new gui.MenuItem({
        type: 'normal',
        label: 'Database'
      });
      var databaseSubmenu = new gui.Menu();
      if (process.platform !== 'win32') {
        rootMenu.insert(DatabaseMenu, position);
        DatabaseMenu.submenu = databaseSubmenu;
      }
      var databaseSubmenuItems = {
        createDatabase: new gui.MenuItem({
          label: 'Create Database...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('createDatabase');
            });
          }
        }),
        dropDatabase: new gui.MenuItem({
          label: 'Drop Database...',
          click: function () {
            if ($rootScope.connection) {
              $rootScope.processing = true;
              $rootScope.connection.dropDatabase($rootScope.connection.db)
                .then(function () {
                  delete $rootScope.connection.db;
                })
                .finally(function () {
                  $rootScope.processing = false;
                })
                .catch($rootScope.showErrorModal)
                .error($rootScope.showErrorModal);
            }
          }
        }),
        renameDatabase: new gui.MenuItem({
          label: 'Rename Database...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('renameDatabase');
            });
          }
        }),
        refreshTables: new gui.MenuItem({
          label: 'Refresh Tables',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('refreshTables');
            });
          }
        }),
        refreshDatabases: new gui.MenuItem({
          label: 'Refresh Databases',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('refreshDatabases');
            });
          }
        }),
        openDatabaseInNewTab: new gui.MenuItem({
          label: 'Open Database in New Tab',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('openDatabaseInNewTab');
            });
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

      if (process.platform === 'win32') {
        DatabaseMenu.submenu = databaseSubmenu;
        rootMenu.append(DatabaseMenu);
      }
    }

    function createTableMenu(rootMenu, position) {
      var TableMenu = new gui.MenuItem({
        type: 'normal',
        label: 'Table'
      });
      var tableSubmenu = new gui.Menu();
      if (process.platform !== 'win32') {
        rootMenu.insert(TableMenu, position);
        TableMenu.submenu = tableSubmenu;
      }
      var tableSubmenuItems = {
        createTable: new gui.MenuItem({
          label: 'Create Table...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('createTable');
            });
          }
        }),
        dropTable: new gui.MenuItem({
          label: 'Drop Table...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('dropTable');
            });
          }
        }),
        emptyTable: new gui.MenuItem({
          label: 'Empty Table...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('emptyTable');
            });
          }
        }),
        createIndex: new gui.MenuItem({
          label: 'Create Index...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('createIndex');
            });
          }
        }),
        dropIndex: new gui.MenuItem({
          label: 'Drop Index...',
          click: function () {
            $timeout(function () {
              $rootScope.$broadcast('dropIndex');
            });
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

      if (process.platform === 'win32') {
        TableMenu.submenu = tableSubmenu;
        rootMenu.append(TableMenu);
      }
    }

    function createHelpMenu(rootMenu) {
      var HelpMenu = new gui.MenuItem({
        type: 'normal',
        label: 'Help'
      });
      var helpSubmenu = new gui.Menu();
      if (process.platform !== 'win32') {
        rootMenu.append(HelpMenu);
        HelpMenu.submenu = helpSubmenu;
      }
      var helpSubmenuItems = {
        onlineHelp: new gui.MenuItem({
          label: 'Online Help',
          click: function () {
            console.log('Online Help');
          }
        })
      };

      helpSubmenu.append(helpSubmenuItems.onlineHelp);

      if (process.platform === 'win32') {
        HelpMenu.submenu = helpSubmenu;
        rootMenu.append(HelpMenu);
      }
    }

    try {
      $log.debug('creating main menu');
      var mainMenu = new gui.Menu({
        type: 'menubar'
      });

      if (process.platform !== 'win32') {
        win.menu = mainMenu;
      }

      createFileMenu(mainMenu, 1);
      createEditMenu(mainMenu, 2);
      createViewMenu(mainMenu, 3);
      createDatabaseMenu(mainMenu, 4);
      createTableMenu(mainMenu, 5);
      createHelpMenu(mainMenu);

      if (process.platform === 'win32') {
        win.menu = mainMenu;
      }

      $rootScope.$watch('connections.length', function (len) {
        win.menu.items[0].submenu.items[10].enabled = len && len > 1;
      });

      win.menu.items[0].submenu.items[3].enabled = false;
      win.menu.items[0].submenu.items[4].enabled = false;
      win.menu.items[0].submenu.items[6].enabled = false;
      win.menu.items[0].submenu.items[7].enabled = false;

      $rootScope.$watch('connection', function (connection) {
        win.menu.items[3].submenu.items[0].enabled = !!connection;
        win.menu.items[3].submenu.items[7].enabled = !!connection;
      });

      $rootScope.$watch('connection.db', function (db) {
        win.menu.items[3].submenu.items[1].enabled = !!db;
        win.menu.items[3].submenu.items[3].enabled = !!db;
        win.menu.items[3].submenu.items[5].enabled = !!db;
        win.menu.items[3].submenu.items[9].enabled = !!db;
        win.menu.items[4].submenu.items[0].enabled = !!db;
      });

      $rootScope.$watch('connection.table', function (table) {
        win.menu.items[4].submenu.items[1].enabled = !!table;
        win.menu.items[4].submenu.items[3].enabled = !!table;
        win.menu.items[4].submenu.items[5].enabled = !!table;
        win.menu.items[4].submenu.items[6].enabled = !!table;
      });
    } catch (err) {
      $log.error(err);
    }
  }
]);
