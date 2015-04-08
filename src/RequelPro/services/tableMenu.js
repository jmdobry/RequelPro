import gui from 'nw.gui';
import Table from '../models/table.js';
import store from './store.js';
import alert from './alert.js';

let TableMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Table'
});
TableMenu.submenu = new gui.Menu();
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Create Table...',
  click() {
    alert.error('Not yet implemented!');
  },
  enabled: false
}));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Table...',
  click() {
    alert.error('Not yet implemented!');
  },
  enabled: false
}));
TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Empty Table...',
  click() {
    alert.error('Not yet implemented!');
  },
  enabled: false
}));
TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Create Index...',
  click() {
    alert.error('Not yet implemented!');
  },
  enabled: false
}));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Index...',
  click() {
    alert.error('Not yet implemented!');
  },
  enabled: false
}));
TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Add new row',
  click(e) {
    Table.emit('addRow', e);
  },
  key: 'a',
  modifiers: 'alt-cmd',
  enabled: false
}));

store.on('route', (params, pathname) => {
  TableMenu.submenu.items[0].enabled = !!(pathname && params.tableId);
  TableMenu.submenu.items[1].enabled = !!(pathname && params.tableId);
  TableMenu.submenu.items[3].enabled = !!(pathname && params.tableId);
  TableMenu.submenu.items[5].enabled = !!(pathname && params.tableId);
  TableMenu.submenu.items[6].enabled = !!(pathname && params.tableId);
  TableMenu.submenu.items[8].enabled = !!(pathname && pathname.indexOf('content') !== -1 && params.tableId);
});

export default TableMenu;
