angular.module('RequelPro').controller('ConnectController', ['$scope', '$log', function ($scope, $log) {
  $log.debug('Begin ConnectController constructor');

  this.connect = function () {
    $log.debug('Being ConnectController.connect()');

    $log.debug('End ConnectController.connect()');
  };

  try {
    $log.debug('End ConnectController constructor');
  } catch (err) {
    $log.error(err);
    $log.error('Failed to instantiate ConnectController!');
  }
}]);
