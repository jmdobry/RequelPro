import gui from 'nw.gui';

let TableMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Table'
});
TableMenu.submenu = new gui.Menu();
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Create Table...',
  click() {
    setTimeout(() => {
      console.log('createTable');
    });
  }
}));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Table...',
  click() {
    setTimeout(() => {
      console.log('dropTable');
    });
  }
}));
TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Empty Table...',
  click() {
    setTimeout(() => {
      console.log('emptyTable');
    });
  }
}));
TableMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Create Index...',
  click() {
    setTimeout(() => {
      console.log('createIndex');
    });
  }
}));
TableMenu.submenu.append(new gui.MenuItem({
  label: 'Drop Index...',
  click() {
    setTimeout(() => {
      console.log('dropIndex');
    });
  }
}));

export default TableMenu;
