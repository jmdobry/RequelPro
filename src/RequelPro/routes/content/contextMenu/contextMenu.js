import gui from 'nw.gui';
import alert from '../../../services/alert.js';
import store from '../../../services/store.js';

let menu = new gui.Menu();

menu.append(new gui.MenuItem({
  label: 'Copy',
  click(e) {
    menu.emit('copy', e);
  },
  key: 'c',
  modifiers: 'cmd'
}));

menu.append(new gui.MenuItem({ type: 'separator' }));

menu.append(new gui.MenuItem({
  label: 'Edit row as JSON',
  click() {
    alert.error('Not yet implemented!');
  },
  key: 'e',
  modifiers: 'cmd'
}));

menu.append(new gui.MenuItem({ type: 'separator' }));

menu.append(new gui.MenuItem({
  label: 'Add new row',
  click(e) {
    menu.emit('addRow', e);
  },
  key: 'a',
  modifiers: 'alt-cmd'
}));

store.utils.Events(menu);

export default menu;
