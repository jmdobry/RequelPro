import gui from 'nw.gui';
import $ from 'jQuery';

function Menu() {
  let menu = new gui.Menu();

  let cut = new gui.MenuItem({
    label: 'Cut',
    click: () => {
      document.execCommand('cut');
    },
    key: 'x',
    modifiers: 'cmd'
  });

  let copy = new gui.MenuItem({
    label: 'Copy',
    click: () => {
      document.execCommand('copy');
    },
    key: 'c',
    modifiers: 'cmd'
  });

  let paste = new gui.MenuItem({
    label: 'Paste',
    click: () => {
      document.execCommand('paste');
    },
    key: 'v',
    modifiers: 'cmd'
  });

  let selectAll = new gui.MenuItem({
    label: 'Select All',
    click: () => {
      document.execCommand('selectAll');
    },
    key: 'a',
    modifiers: 'cmd'
  });

  menu.append(cut);
  menu.append(copy);
  menu.append(paste);
  menu.append(selectAll);

  return menu;
}

let menu = new Menu();

$(document).on('contextmenu', e => {
  e.preventDefault();
  menu.popup(e.originalEvent.x, e.originalEvent.y);
});

export default menu;
