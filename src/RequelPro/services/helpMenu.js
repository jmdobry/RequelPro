import gui from 'nw.gui';
import alert from './alert.js';

let HelpMenu = new gui.MenuItem({
  type: 'normal',
  label: 'Help'
});
HelpMenu.submenu = new gui.Menu();
HelpMenu.submenu.append(new gui.MenuItem({
  label: 'Online Help',
  click() {
    alert.error('Not yet implemented!');
  }
}));

export default HelpMenu;
