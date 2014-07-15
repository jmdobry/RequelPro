angular.module('RequelPro').controller('ConnectController', ['$scope', '$log', '$location', 'DS',
  function ($scope, $log, $location, DS) {
    $log.debug('Begin ConnectController constructor');

    this.connect = function (options, redirect) {
      $log.debug('Being ConnectController.connect()', options, redirect);

      DS.create('connection', options)
        .then(function (connection) {
          $log.debug('connection created', connection);
          if (redirect) {
            $location.path('/content/' + connection.id);
          } else {
            $log.debug('show connection success');
          }
        }, function (err) {
          $log.error(err);
        }).finally(function () {
          $log.debug('End ConnectController.connect()');
        });
    };

    try {
      this.options = {
        host: '',
        port: '',
        db: '',
        authKey: ''
      };

      $log.debug('End ConnectController constructor');
    } catch (err) {
      $log.error(err);
      $log.error('Failed to instantiate ConnectController!');
    }
  }
]);
