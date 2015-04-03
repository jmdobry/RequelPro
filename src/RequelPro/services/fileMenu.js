import gui from 'nw.gui';

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
  label: 'New Connection Window',
  click() {
    gui.Window.get(window.open(window.location.href));
  },
  key: 'n',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'New Connection Tab',
  click() {
    setTimeout(() => {
      //$state.go('new');
    });
  },
  key: 't',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Open...',
  click() {
    setTimeout(() => {
      console.log('open');
    });
  },
  key: 'o',
  modifiers: 'cmd'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Open Recent',
  click() {
    setTimeout(() => {
      console.log('openRecent');
    });
  }
}));
FileMenu.submenu.append(new gui.MenuItem({ type: 'separator' }));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Import...',
  click() {
    chooseFile('#import-file-dialog');
    setTimeout(() => {
      console.log('import');
    });
  },
  key: 'i',
  modifiers: 'cmd-shift'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Export...',
  click() {
    setTimeout(() => {
      console.log('export');
    });
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
    setTimeout(() => {
      console.log('$destroy');
      win.close();
    });
  },
  key: 'w',
  modifiers: 'cmd-shift'
}));
FileMenu.submenu.append(new gui.MenuItem({
  label: 'Close Tab',
  click() {
    setTimeout(() => {
      console.log('closeTab');
    });
  },
  key: 'w',
  modifiers: 'cmd-shift'
}));

export default FileMenu;
