var gui = require('nw.gui'),
	win = gui.Window.get();

win.on('loaded', function () {
	win.show();
	win.maximize();
	win.removeAllListeners('loaded');
});

angular.module('ReQuery', ['ngSanitize', 'ui.router'])
	.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

		$urlRouterProvider.otherwise("/connections");

		$stateProvider
			.state('connections', {
				url: "/connections",
				templateUrl: "./js/connections/controllers/connectionsPage.html",
				controller: 'ConnectionsController',
				controllerAs: 'ConnCtrl'
			})
			.state('state2', {
				url: "/test2",
				templateUrl: "./js/test2.html",
				controller: 'MyCtrl',
				controllerAs: 'My'
			});
	}])
	.run([function () {
		// Load native UI library
		var menu = new gui.Menu({ type: 'menubar' }),
			item1 = new gui.MenuItem({
				type: 'normal',
				label: 'Item A'
			}),
			item2 = new gui.MenuItem({
				type: 'normal',
				label: 'Item B'
			}),
			item3 = new gui.MenuItem({
				type: 'separator' }),
			submenu = new gui.Menu(),
			submenu2 = new gui.Menu();

		var subitem1 = new gui.MenuItem({ label: 'Item 1' });
		submenu.append(subitem1);
		submenu.append(new gui.MenuItem({ label: 'Item 2' }));
		submenu.append(new gui.MenuItem({ label: 'Item 3' }));
		item1.submenu = submenu;

		subitem1.click = function () {
			console.log('New click callback');
		};
		submenu2.append(new gui.MenuItem({ label: 'Item 3' }));
		submenu2.append(new gui.MenuItem({ label: 'Item 4' }));
		submenu2.append(new gui.MenuItem({ label: 'Item 5' }));
		item2.submenu = submenu2;

		item2.click = function () {
			console.log('New click 2 callback');
		};

		menu.append(item1);
		menu.append(item2);
		menu.append(item3);

		for (var i = 0; i < menu.items.length; ++i) {
			console.log(menu.items[i]);
		}

		win.menu = menu;

		var item4 = new gui.MenuItem({
				type: 'normal',
				label: 'Help'
			}),
			submenu4 = new gui.Menu();

		submenu4.append(new gui.MenuItem({
			label: 'Online Help'
		}));
		item4.submenu = submenu4;
		menu.append(item4);
	}])
	.controller('MyCtrl', function ($scope, $sce) {
		$scope.stuff = 'hello';
		this.adminUrls = [
			$sce.trustAsResourceUrl('http://localhost:8080'),
			$sce.trustAsResourceUrl('http://db.codetrain.io')
		];
		this.activeAdminUrl = '';
	});
