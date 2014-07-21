angular.module('RequelPro').controller('ConnectController', ['$rootScope', '$scope', '$log', '$state', 'DS', 'mout', '$window', '$timeout', '$modal', 'Connection', 'Favorite',
  function ($rootScope, $scope, $log, $state, DS, mout, $window, $timeout, $modal, Connection, Favorite) {
    var _this = this;

    function showErrorModal(err) {
      $log.error(err);
      $modal({
        title: 'Failure!',
        content: err.stack,
        backdrop: 'static',
        placement: 'center',
        html: true,
        animation: 'danger am-flip-x'
      });
    }

    function showSuccessModal(message) {
      $modal({
        title: 'Success!',
        content: message,
        backdrop: 'static',
        placement: 'center',
        html: true,
        animation: 'success am-flip-x'
      });
    }

    this.connect = function (favorite) {
      $scope.processing = true;
      var connection = Connection.createInstance();
      mout.object.deepMixIn(connection, favorite);

      delete connection.id;
      delete connection._id;

      connection.host = connection.host || '127.0.0.1';
      connection.port = connection.port || 28015;

      connection.connect()
        .then(function (conn) {
          if (conn) {
            conn.close();
          }
          connection.id = mout.random.guid();
          DS.store.connection.completedQueries[connection.id] = new Date().getTime();
          $rootScope.connection = Connection.inject(connection);

          $timeout(function () {
            $state.go('content', {
              id: connection.id
            }).then($log.debug, $log.error);
          });
        })
        .finally(function () {
          $scope.processing = false;
        })
        .catch(showErrorModal)
        .error(showErrorModal);
    };

    this.save = function (favorite) {
      favorite.host = favorite.host || '127.0.0.1';
      favorite.port = favorite.port || 28015;

      $scope.processing = true;

      if (favorite.id) {
        Favorite.update(favorite.id, favorite)
          .then(function () {
            $scope.processing = false;
          }, showErrorModal);
      } else {
        Favorite.create(favorite)
          .then(function () {
            $scope.processing = false;
          }, showErrorModal);
      }
    };

    this.remove = function (favorite) {
      DS.destroy('favorite', favorite.id);
    };

    this.test = function (favorite) {
      var connection = Connection.createInstance();
      mout.object.deepMixIn(connection, favorite);

      connection.connect()
        .then(function (conn) {
          if (conn) {
            conn.close();
          }
          showSuccessModal('Connection established!');
        })
        .catch(showErrorModal)
        .error(showErrorModal);
    };

    this.newConnection = function () {
      mout.object.deepMixIn(this.newFav, {
        host: '',
        port: '',
        db: '',
        authKey: ''
      });
      this.fav = this.newFav;
    };

    try {
      this.newFav = Favorite.createInstance();
      this.newConnection();

      $log.debug('current favorite', this.fav);

      $scope.$watch(function () {
        return Favorite.lastModified();
      }, function () {
        _this.favorites = Favorite.filter();
      });

      $timeout(function () {
        _this.showForm = true;
      }, 300);

      $timeout(function () {
        _this.showList = true;
      }, 400);
    } catch (err) {
      $log.error(err);
      $log.error('Failed to instantiate ConnectController!');
    }
  }
]);
