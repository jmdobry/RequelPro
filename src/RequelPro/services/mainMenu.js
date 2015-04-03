/**
 ⌘ – \u2318 – the Command Key symbol
 ⌥ – \u2325 – the Option Key symbol
 ⇧ – \u21E7 – the Shift Key symbol
 ⎋ – \u238B – the ESC Key symbol
 ⇪ – \u21ea – the Capslock symbol
 ⏎ – \u23ce – the Return symbol
 ⌫ – \u232b – the Delete / Backspace symbol
 */
import gui from 'nw.gui';
import FileMenu from './fileMenu.js';
import ViewMenu from './viewMenu.js';
import DatabaseMenu from './databaseMenu.js';
import TableMenu from './tableMenu.js';
import HelpMenu from './helpMenu.js';

let win = gui.Window.get();

function setupEditMenu(rootMenu, position) {
  let EditMenu = rootMenu.items[position];
  let items = EditMenu.submenu.items;
  items[0].click = () => {
    document.execCommand('undo');
  };
  items[0].key = 'z';
  items[0].modifiers = 'cmd';
  items[1].click = () => {
    document.execCommand('redo');
  };
  items[1].key = 'z';
  items[1].modifiers = 'cmd-shift';
  items[3].click = () => {
    document.execCommand('cut');
  };
  items[3].key = 'x';
  items[3].modifiers = 'cmd';
  items[4].click = () => {
    document.execCommand('copy');
  };
  items[4].key = 'c';
  items[4].modifiers = 'cmd';
  items[5].click = () => {
    document.execCommand('paste');
  };
  items[5].key = 'v';
  items[5].modifiers = 'cmd';
}

try {
  console.log('creating main menu');
  let mainMenu = new gui.Menu({ type: 'menubar' });

  mainMenu.createMacBuiltin('Requel Pro');
  win.menu = mainMenu;

  mainMenu.insert(FileMenu, 1);
  setupEditMenu(mainMenu, 2);
  mainMenu.insert(ViewMenu, 3);
  mainMenu.insert(DatabaseMenu, 4);
  mainMenu.insert(TableMenu, 5);
  mainMenu.append(HelpMenu);

  win.menu.items[1].submenu.items[6].enabled = false;
  win.menu.items[1].submenu.items[7].enabled = false;

  //$rootScope.$watch('connection', function (connection) {
  //  win.menu.items[1].submenu.items[6].enabled = !!connection;
  //  win.menu.items[1].submenu.items[7].enabled = !!connection;
  //});

  //$rootScope.$watch('connection.db', function (db) {
  //  win.menu.items[3].submenu.items[1].enabled = !!db;
  //  win.menu.items[3].submenu.items[3].enabled = !!db;
  //  win.menu.items[3].submenu.items[5].enabled = !!db;
  //  win.menu.items[3].submenu.items[9].enabled = !!db;
  //  win.menu.items[4].submenu.items[0].enabled = !!db;
  //});
  //
  //$rootScope.$watch('connection.table', function (table) {
  //  win.menu.items[4].submenu.items[1].enabled = !!table;
  //  win.menu.items[4].submenu.items[3].enabled = !!table;
  //  win.menu.items[4].submenu.items[5].enabled = !!table;
  //  win.menu.items[4].submenu.items[6].enabled = !!table;
  //});
} catch (err) {
  console.error(err);
}
