angular.module('RequelPro').controller('ConnectController', ['$rootScope', '$scope', '$log', '$state', 'DS', 'mout', '$window', '$timeout', '$modal',
  function ($rootScope, $scope, $log, $state, DS, mout, $window, $timeout, $modal) {
    $log.debug('Begin ConnectController constructor');

    var _this = this;
    var Favorite = DS.definitions.favorite[DS.definitions.favorite.class];
    var Connection = DS.definitions.connection[DS.definitions.connection.class];

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
      $log.debug('Begin ConnectController.connect()', favorite);

      var connection = new Connection();
      mout.object.deepMixIn(connection, favorite);

      delete connection.id;

      connection.host = connection.host || '127.0.0.1';
      connection.port = connection.port || 28015;

      connection.connect()
        .then(function (conn) {
          if (conn) {
            conn.close();
          }
          $rootScope.connection = DS.inject('connection', connection);

          $state.go('content', {
            id: connection.id
          });
        })
        .catch(showErrorModal)
        .error(showErrorModal);
    };

    this.save = function (favorite) {

      favorite.host = favorite.host || '127.0.0.1';
      favorite.port = favorite.port || 28015;

      $scope.processing = true;

      if (favorite.id) {
        DS.update('favorite', favorite.id, favorite)
          .then(function () {
            $scope.processing = false;
          }, showErrorModal);
      } else {
        DS.create('favorite', favorite)
          .then(function () {
            $scope.processing = false;
          }, showErrorModal);
      }
    };

    this.remove = function (favorite) {
      DS.destroy('favorite', favorite.id);
    };

    this.test = function (favorite) {
      var connection = new Connection();
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
      this.newFav = new Favorite();
      this.newConnection();

      $scope.$watch(function () {
        return DS.lastModified('favorite');
      }, function () {
        _this.favorites = DS.filter('favorite');
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
