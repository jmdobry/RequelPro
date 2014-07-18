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
    controller: ['$scope', '$timeout', '$log', '$state', '$modal', function ($scope, $timeout, $log, $state, $modal) {

      var _this = this;

      function showErrorModal(err) {
        $log.error(err);
        $modal({
          title: 'Failed to retrieve databases!',
          content: err.stack,
          backdrop: 'static',
          placement: 'center',
          animation: 'danger am-flip-x'
        });
      }

      this.navigate = function (state, params, requiresConnection) {
        if (!requiresConnection || (requiresConnection && $scope.connection && $scope.connection.id)) {
          $state.go(state, params);
        }
      };

      $scope.$watch('connection.db', function (db) {
        console.log(db);
      });

      $scope.$watch('connection.id', function (id, prev) {
        if (id && id !== prev) {
          $scope.processing = true;
          $scope.connection.dbList()
            .then(function (dbList) {
              $timeout(function () {
                if (dbList.length) {
                  $scope.connection.db = dbList[0];
                }
                $scope.dbList = dbList;
              });
            })
            .finally(function () {
              $scope.processing = false;
            })
            .catch(showErrorModal)
            .error(showErrorModal);
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

      $timeout(function () {
        _this.show = true;
      }, 1200);
    }]
  };
});
