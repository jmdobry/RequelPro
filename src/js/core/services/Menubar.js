angular.module('ReQuery').service('MenubarService', function ($location) {
	'use strict';
	var menu = new gui.Menu({ type: 'menubar' }),
		fileSubmenu = new gui.Menu(),
		editSubmenu,
		viewSubmenu = new gui.Menu(),
		databaseSubmenu = new gui.Menu(),
		tableSubmenu = new gui.Menu(),
		windowSubmenu = new gui.Menu(),
		helpSubmenu = new gui.Menu(),
		mainMenuItems;

	var fileSubmenuItems = {
		newConnectionWindow: new gui.MenuItem({
			label: 'New Connection Window',
			click: function () {
				gui.Window.get(window.open($location.absUrl()));
			}
		}),
		newConnectionTab: new gui.MenuItem({
			label: 'New Connection Tab',
			click: function () {
				console.log('New Connection Tab');
				console.log(win.menu);
			}
		}),
		open: new gui.MenuItem({
			label: 'Open...',
			click: function () {
				console.log('Open...');
			}
		}),
		openRecent: new gui.MenuItem({
			label: 'Open Recent',
			click: function () {
				console.log('Open Recent');
			}
		})
	};

	fileSubmenu.append(fileSubmenuItems.newConnectionWindow);
	fileSubmenu.append(fileSubmenuItems.newConnectionTab);
	fileSubmenu.append(new gui.MenuItem({ type: 'separator' }));
	fileSubmenu.append(fileSubmenuItems.open);
	fileSubmenu.append(fileSubmenuItems.openRecent);

	var helpSubmenuItems = {
		onlineHelp: new gui.MenuItem({
			label: 'Online Help',
			click: function () {
				console.log('Online Help');
			}
		})
	};

	helpSubmenu.append(helpSubmenuItems.onlineHelp);

	mainMenuItems = {
		File: new gui.MenuItem({
			type: 'normal',
			label: 'File',
			submenu: fileSubmenu
		}),
		View: new gui.MenuItem({
			type: 'normal',
			label: 'View'
		}),
		Database: new gui.MenuItem({
			type: 'normal',
			label: 'Database'
		}),
		Table: new gui.MenuItem({
			type: 'normal',
			label: 'Table'
		}),
		Window: new gui.MenuItem({
			type: 'normal',
			label: 'Window'
		}),
		Help: new gui.MenuItem({
			type: 'normal',
			label: 'Help',
			submenu: helpSubmenu
		})
	};

	win.menu = menu;
	win.menu.insert(mainMenuItems.File, 1);
	win.menu.insert(new gui.MenuItem({
		type: 'normal',
		label: 'Edit'
	}), 2);
	win.menu.append(mainMenuItems.Help);

	win.menu.items[1].submenu = new gui.Menu();
	editSubmenu = win.menu.items[1].submenu;
	editSubmenu.append(new gui.MenuItem({
		label: 'Undo',
		click: function () {
			console.log('Undo');
		}
	}));
	editSubmenu.append(new gui.MenuItem({
		label: 'Redo',
		click: function () {
			console.log('Redo');
		}
	}));
	editSubmenu.append(new gui.MenuItem({ type: 'separator' }));
	editSubmenu.append(new gui.MenuItem({
		label: 'Cut',
		click: function () {
			console.log('Cut');
		}
	}));
	editSubmenu.append(new gui.MenuItem({
		label: 'Copy',
		click: function () {
			console.log('Copy');
		}
	}));
	editSubmenu.append(new gui.MenuItem({
		label: 'Paste',
		click: function () {
			console.log('Paste');
		}
	}));

	return win.menu;
});
