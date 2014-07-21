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
    controller: ['$rootScope', '$scope', '$log', '$timeout', '$state', 'Connection',
      function ($rootScope, $scope, $log, $timeout, $state, Connection) {

        var _this = this;

        _this.connections = [];

        $scope.$watch(function () {
          return Connection.lastModified();
        }, function () {
          _this.connections = Connection.filter({
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
