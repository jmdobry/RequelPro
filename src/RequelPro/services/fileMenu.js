import gui from 'nw.gui';
import Connection from '../models/connection.js';
import store from './store.js';
import alert from './alert.js';

let win = gui.Window.get();

let chooseFile = name => {
  let chooser = document.querySelector(name);

  chooser.addEventListener('change', function () {
    console.log(this.value);
  }, false);

  chooser.click();
};

let FileMenu = new gui.MenuItem({
  type: 'normal',
  label: 'File'
});
FileMenu.submenu = new gui.Menu();

FileMenu.submenu.append(new gui.MenuItem({
  label: 'New Connection Tab',
  click() {
    Connection.emit('newTab');
  },
  key: 't',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Open...',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'o',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Open Recent',
  click() {
    alert.error('Not yet implemented!');
  }
}));
FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Import...',
  click() {
    alert.error('Not yet implemented!');
    chooseFile('#import-file-dialog');
  },
  key: 'i',
  modifiers: 'cmd-shift'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Export...',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'e',
  modifiers: 'cmd-shift'
}));
FileMenu.submenu.append(new gui.MenuItem({
  type: 'separator'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Close Window',
  click() {
    win.close();
  },
  key: 'w',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Close Tab',
  click() {
    Connection.emit('closeTab');
  },
  key: 'w',
  modifiers: 'cmd-shift',
  enabled: false
}));

store.on('route', () => {
  FileMenu.submenu.items[9].enabled = Connection.getAll().length;
});

export default FileMenu;
