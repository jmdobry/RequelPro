angular.module('RequelPro').directive('navTabs', function () {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'core/directives/navTabs.html',
    controllerAs: 'NTCtrl',
    controller: ['$rootScope', '$timeout',
      function ($rootScope, $timeout) {

        $rootScope.$watch('connections.length', function (show) {
          $rootScope.showTabs = !!show;
        });

        $timeout(function () {
          $rootScope.show = !!$rootScope.connections.length;
        }, 1300);
      }
    ]
  };
});
