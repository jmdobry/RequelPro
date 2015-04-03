import gui from 'nw.gui';

let ViewMenu = new gui.MenuItem({
  type: 'normal',
  label: 'View'
});
ViewMenu.submenu = new gui.Menu();
ViewMenu.submenu.append(new gui.MenuItem({
  label: 'Test click view',
  click() {
    console.log('Test click view');
  }
}));

export default ViewMenu;
