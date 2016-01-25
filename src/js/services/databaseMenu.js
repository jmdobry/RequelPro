import gui from 'nw.gui';
import alert from './alert.js';
import store from './store.js';
import Database from '../models/database.js';

let DatabaseMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Database'
});
DatabaseMenu.submenu = new gui.Menu();
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Create Database...',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'a',
  modifiers: 'shift-alt'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Database...',
  click() {
    alert.error('Not yet implemented!');
  }
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Rename Database...',
  click() {
    alert.error('Not yet implemented!');
  }
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Refresh Tables',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'r',
  modifiers: 'ctrl-cmd'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Refresh Databases',
  click() {
    Database.emit('refresh');
  },
  key: 'r',
  modifiers: 'shift-cmd'
}));
DatabaseMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
DatabaseMenu.submenu.append(new gui.MenuItem({
  label: 'Open Database in New Tab',
  click() {
    Database.emit('databaseInNewTab');
  }
}));

store.on('route', (params, pathname) => {
  DatabaseMenu.submenu.items[0].enabled = !!(pathname && params.id);
  DatabaseMenu.submenu.items[1].enabled = !!(pathname && params.id && params.databaseId);
  DatabaseMenu.submenu.items[3].enabled = !!(pathname && params.id && params.databaseId);
  DatabaseMenu.submenu.items[5].enabled = !!(pathname && params.id && params.databaseId);
  DatabaseMenu.submenu.items[7].enabled = !!(pathname && params.id);
  DatabaseMenu.submenu.items[9].enabled = !!(pathname && params.id && params.databaseId);
});

export default DatabaseMenu;
