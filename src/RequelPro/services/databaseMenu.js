import gui from 'nw.gui';

let DatabaseMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Database'
});
DatabaseMenu.submenu = new gui.Menu();
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Create Database...',
  click() {
    setTimeout(() => {
      console.log('createDatabase');
    });
  },
  key: 'a',
  modifiers: 'shift-alt'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Database...',
  click() {
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
  click() {
    setTimeout(() => {
      console.log('renameDatabase');
    });
  }
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Refresh Tables',
  click() {
    setTimeout(() => {
      console.log('refreshTables');
    });
  },
  key: 'r',
  modifiers: 'ctrl-cmd'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Refresh Databases',
  click() {
    setTimeout(() => {
      console.log('refreshDatabases');
    });
  },
  key: 'r',
  modifiers: 'shift-cmd'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Open Database in New Tab',
  click() {
    setTimeout(() => {
      console.log('openDatabaseInNewTab');
    });
  }
}));

export default DatabaseMenu;
