angular.module('RequelPro').directive('navMenu', function () {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'core/directives/navMenu.html',
    controllerAs: 'NMCtrl',
    controller: function ($scope, $rootScope, $timeout) {

      var _this = this;

      function getDbList() {
        if ($scope.connection) {
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
            .catch(function (err) {
              $rootScope.showError('Failed to retrieve databases!', err.msg || err);
            })
            .error(function (err) {
              $rootScope.showError('Failed to retrieve databases!', err.msg || err);
            });
        }
      }

      $scope.$watch('connection.db', function (cur, prev) {
        if (!cur && prev || cur && !prev) {
          getDbList();
        }
      });

      $scope.$watch('connection.id', function (id, prev) {
        if (id && id !== prev) {
          getDbList();
        } else if (!id) {
          $scope.dbList = [];
          $scope.processing = true;
        }
      });

      $timeout(function () {
        _this.show = true;
      }, 1200);
    }
  };
});
