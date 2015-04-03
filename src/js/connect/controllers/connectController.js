angular.module('RequelPro').controller('ConnectController', function ($rootScope, $scope, $log, $state, DS, mout, $window, $timeout, $modal, Connection, Favorite) {
  var _this = this;

  this.connect = function (favorite) {
    $rootScope.processing = true;
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
        $rootScope.processing = false;
      })
      .catch(function (err) {
        $rootScope.showError('Failed to connect!', err.msg || err);
      })
      .error(function (err) {
        $rootScope.showError('Failed to connect!', err.msg || err);
      });
  };

  this.save = function (favorite) {
    favorite.host = favorite.host || '127.0.0.1';
    favorite.port = favorite.port || 28015;

    $rootScope.processing = true;

    if (favorite.id) {
      Favorite.update(favorite.id, favorite)
        .then(null, function (err) {
          $rootScope.showError('Failed to save favorite!', err.msg || err);
        }).finally(function () {
          $rootScope.processing = false;
        });
    } else {
      Favorite.create(favorite)
        .then(null, function (err) {
          $rootScope.showError('Failed to save favorite!', err.msg || err);
        }).finally(function () {
          $rootScope.processing = false;
        });
    }
  };

  this.remove = function (favorite) {
    DS.destroy('favorite', favorite.id);
  };

  this.test = function (favorite) {
    var connection = Connection.createInstance();
    mout.object.deepMixIn(connection, favorite);

    $rootScope.processing = true;

    connection.connect()
      .then(function (conn) {
        if (conn) {
          conn.close();
        }
        $rootScope.showSuccess('Connection established!');
      })
      .finally(function () {
        $rootScope.processing = false;
      })
      .catch(function (err) {
        $rootScope.showError('Failed to connect!', err.msg || err);
      })
      .error(function (err) {
        $rootScope.showError('Failed to connect!', err.msg || err);
      });
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
});
