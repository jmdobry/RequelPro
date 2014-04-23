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
	.run(function ($log, MenubarService) {
		// Load native UI library
		try {
			$log.debug('MenubarService loaded', MenubarService);
		} catch (e) {
			$log.error(e);
		}
	})
	.controller('MyCtrl', function ($scope, $sce) {
		$scope.stuff = 'hello';
		this.adminUrls = [
			$sce.trustAsResourceUrl('http://localhost:8080'),
			$sce.trustAsResourceUrl('http://db.codetrain.io')
		];
		this.activeAdminUrl = '';
	});
