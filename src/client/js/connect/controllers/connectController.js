angular.module('RequelPro').controller('ConnectController', ['$scope', '$log', '$state', 'DS', 'mout', '$window', '$timeout',
  function ($scope, $log, $state, DS, mout, $window, $timeout) {
    $log.debug('Begin ConnectController constructor');

    var _this = this;
    var Connection = DS.definitions.connection[DS.definitions.connection.class];

    this.connect = function (connection) {
      $log.debug('Begin ConnectController.connect()', connection);

      connection.host = connection.host || '127.0.0.1';
      connection.port = connection.port || 28015;

      connection.connect()
        .then(function (conn) {
          if (conn) {
            conn.close();
          }
          if (connection.id) {
            $state.go('content', {
              id: connection.id
            }).then(null, function (err) {
              $log.error(err);
            });
          } else {
            DS.create('connection', connection)
              .then(function (connection) {
                $state.go('content', {
                  id: connection.id
                });
              }, function (err) {
                $log.error(err);
              }).finally(function () {
                $log.debug('End ConnectController.connect()');
              });
          }
        })
        .catch(function (err) {
          $window.alert(err.message);
        })
        .error(function (err) {
          $window.alert(err.message);
        });
    };

    this.remove = function (connection) {
      DS.destroy('connection', connection.id);
    };

    this.test = function (connection) {
      connection.connect()
        .then(function (conn) {
          if (conn) {
            conn.close();
          }
          $window.alert('Connection succeeded!');
        })
        .catch(function (err) {
          $window.alert(err.message);
        })
        .error(function (err) {
          $window.alert(err.message);
        });
    };

    try {
      this.newConnection = new Connection();
      mout.object.deepMixIn(this.newConnection, {
        host: '',
        port: '',
        db: '',
        authKey: ''
      });
      this.connection = this.newConnection;

      DS.findAll('connection');

      $scope.$watch(function () {
        return DS.lastModified('connection');
      }, function () {
        _this.connections = DS.filter('connection');
      });

      $timeout(function () {
        _this.showForm = true;
      }, 600);

      $timeout(function () {
        _this.showList = true;
      }, 700);

      $log.debug('End ConnectController constructor');
    } catch (err) {
      $log.error(err);
      $log.error('Failed to instantiate ConnectController!');
    }
  }
]);
