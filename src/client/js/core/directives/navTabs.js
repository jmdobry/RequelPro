angular.module('RequelPro').directive('navTabs', function () {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      connection: '='
    },
    replace: true,
    templateUrl: 'core/directives/navTabs.html',
    controllerAs: 'NTCtrl',
    controller: ['$rootScope', '$scope', '$log', '$timeout', '$state', 'DS',
      function ($rootScope, $scope, $log, $timeout, $state, DS) {

        var _this = this;

        _this.connections = [];

        $scope.$watch(function () {
          return DS.lastModified('connection');
        }, function () {
          _this.connections = DS.filter('connection', {
            active: true
          });

          _this.show = !!_this.connections.length;
        });

        $timeout(function () {
          _this.show = !!_this.connections.length;
        }, 1300);

        $rootScope.$on('newConnectionTab', function () {
          $state.go('new');
        });
      }
    ]
  };
});
