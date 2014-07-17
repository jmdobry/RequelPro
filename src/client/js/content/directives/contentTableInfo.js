angular.module('RequelPro').directive('contentTableInfo', [
  function () {
    return {
      restrict: 'E',
      scope: {
        connection: '='
      },
      replace: true,
      controllerAs: 'CTICtrl',
      templateUrl: 'content/directives/contentTableInfo.html',
      controller: ['$scope', '$log', '$timeout', function ($scope, $log, $timeout) {

        $scope.$watch('connection.table', function (table) {
          if (table && $scope.connection) {
            $scope.processing = true;
            $scope.connection.tableInfo($scope.connection.db, table)
              .then(function (tableInfo) {
                $timeout(function () {
                  $scope.tableInfo = tableInfo;
                });
              })
              .finally(function () {
                $scope.processing = false;
              })
              .catch($log.error)
              .error($log.error);
          }
        });
      }]
    };
  }
]);
