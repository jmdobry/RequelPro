angular.module('RequelPro').directive('navMenu', function () {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      connection: '='
    },
    replace: true,
    templateUrl: 'core/directives/navMenu.html',
    controllerAs: 'NMCtrl',
    controller: ['$scope', '$timeout', '$log', '$state', function ($scope, $timeout, $log, $state) {

      this.navigate = function (state, params, requiresConnection) {
        if (!requiresConnection || (requiresConnection && $scope.connection && $scope.connection.id)) {
          $state.go(state, params);
        }
      };

      $scope.$watch('connection.id', function (id, prev) {
        if (id && id !== prev) {
          $scope.processing = true;
          $scope.connection.dbList()
            .then(function (dbList) {
              $timeout(function () {
                $scope.dbList = dbList;
              });
            })
            .finally(function () {
              $scope.processing = false;
            })
            .catch(function (err) {
              $log.error(err);
              $scope.error = true;
            })
            .error(function (err) {
              $log.error(err);
              $scope.error = true;
            });
        } else if (!id) {
          $scope.dbList = [];
          $scope.processing = true;
        }
      });

      $scope.$watch(function () {
        return $state.current.name;
      }, function (name) {
        $scope.state = name;
      });
    }]
  };
});
