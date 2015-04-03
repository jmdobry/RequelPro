import gui from 'nw.gui';

let HelpMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Help'
});
HelpMenu.submenu = new gui.Menu();
HelpMenu.submenu.append(new gui.MenuItem({
  label: 'Online Help',
  click() {
    console.log('Online Help');
  }
}));

export default HelpMenu;
