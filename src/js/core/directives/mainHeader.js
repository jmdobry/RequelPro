angular.module('ReQuery').directive('mainHeader', ['$window', function ($window) {
	'use strict';
	return {
		restrict: 'E',
		replace: true,
		templateUrl: './js/core/directives/mainHeader.html',
		link: function ($scope) {
		}
	};
}]);
