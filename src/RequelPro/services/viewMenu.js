import gui from 'nw.gui';
import alert from './alert.js';
import store from './store.js';
import Connection from '../models/connection.js';

let ViewMenu = new gui.MenuItem({
  type: 'normal',
  label: 'View'
});
ViewMenu.submenu = new gui.Menu();
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Show Tab Bar',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'a',
  modifiers: 'shift-alt'
}));
ViewMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Table Structure',
  click() {
    Connection.emit('route', { name: 'structure' });
  },
  key: '1',
  modifiers: 'cmd'
}));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Table Content',
  click() {
    Connection.emit('route', { name: 'content' });
  },
  key: '2',
  modifiers: 'cmd'
}));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Table Relations',
  click() {
    Connection.emit('route', { name: 'relations' });
  },
  key: '3',
  modifiers: 'cmd'
}));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Table Info',
  click() {
    Connection.emit('route', { name: 'info' });
  },
  key: '4',
  modifiers: 'cmd'
}));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Run Query',
  click() {
    Connection.emit('route', { name: 'query' });
  },
  key: '5',
  modifiers: 'cmd'
}));
ViewMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Back In History',
  click() {
    store.emit('goBack');
  },
  key: '⌫',
  modifiers: ''
}));

export default ViewMenu;
