/* jshint camelcase: false */
angular.module('RequelPro').controller('ContentController', ['$scope', '$log', '$location', 'DS', '$state', '$timeout', 'mout',
  function ($scope, $log, $location, DS, $state, $timeout, mout) {
    $log.debug('Begin ContentController constructor');

    var _this = this;
    var r = require('rethinkdb');
    var prevTarget;
    var $prevTarget;
    var prevValue;

    function processRows(rows, tableInfo) {
      _this.primaryKey = tableInfo.primary_key;
      var fields = {};
      angular.forEach(rows, function (row) {
        mout.object.forOwn(row, function (value, key) {
          fields[key] = typeof value;
        });
      });
      delete fields[_this.primaryKey];
      _this.fields = mout.object.keys(fields);
      _this.fields.unshift(_this.primaryKey);
      return rows;
    }

    function updateRow(index) {
      var connection;
      _this.processing = true;
      _this.connection.connect()
        .then(function (conn) {
          connection = conn;
          return r.db(_this.connection.db).table(_this.connection.table).get(_this.rows[index][_this.primaryKey]).update(_this.rows[index], { return_vals: true }).run(conn);
        })
        .then(function (cursor) {
          $timeout(function () {
            mout.object.deepMixIn(_this.rows[index], cursor.new_val);
          });
        })
        .catch(function (err) {
          $log.error(err);
        })
        .error(function (err) {
          $log.error(err);
        })
        .finally(function () {
          _this.processing = false;
          if (connection) {
            return connection.close();
          }
        });
    }

    this.selectRow = function (index) {
      if (this.selectedRow !== index && $prevTarget) {
        $prevTarget.find('input').off('blur keydown').addClass('ng-hide');
        $prevTarget.find('span').removeClass('ng-hide');
        prevTarget = $prevTarget = null;
      } else if (this.selectedRow === index) {
        return;
      }
      this.selectedRow = index;
    };

    this.offClick = function ($event) {
      if ($prevTarget && prevTarget && prevTarget !== $event.target) {
        $prevTarget.find('input').off('blur keydown').addClass('ng-hide');
        $prevTarget.find('span').removeClass('ng-hide');
        prevTarget = $prevTarget = null;
      }
    };

    this.selectField = function ($event, parentIndex) {
      if (parentIndex === this.selectedRow) {
        if (prevTarget && prevTarget !== $event.currentTarget) {
          $prevTarget.find('input').off('blur keydown').addClass('ng-hide');
          $prevTarget.find('span').removeClass('ng-hide');
          prevTarget = $prevTarget = null;
        } else {
          var $el = angular.element($event.currentTarget);
          var $input = $el.find('input');
          var $span = $el.find('span');

          $span.addClass('ng-hide');
          $input
            .removeClass('ng-hide')
            .on('blur', function () {
              $input.off('blur keydown').addClass('ng-hide');
              $span.removeClass('ng-hide');
              prevTarget = $prevTarget = null;
              if ($input.val() !== prevValue) {
                updateRow(_this.selectedRow);
              }
            })
            .on('keydown', function (e) {
              if (e.keyCode === 13) {
                $input.off('keydown blur').addClass('ng-hide');
                $span.removeClass('ng-hide');
                prevTarget = $prevTarget = null;
                if ($input.val() !== prevValue) {
                  updateRow(_this.selectedRow);
                }
              }
            });

          prevTarget = $event.currentTarget;
          $prevTarget = $el;
          prevValue = $input.val();

          $event.preventDefault();
          $event.stopPropagation();
        }
      }
    };

    try {
      DS.find('connection', $state.params.id);

      $scope.$watch(function () {
        return DS.lastModified('connection', $state.params.id);
      }, function () {
        _this.connection = DS.get('connection', $state.params.id);

        if (_this.connection) {
          _this.connection.dbList()
            .then(function (dbList) {
              $timeout(function () {
                $log.debug('dbList:', dbList);
                _this.dbList = dbList;
              });
            })
            .catch(function (err) {
              $log.error(err);
            })
            .error(function (err) {
              $log.error(err);
            });
        }
      });

      $scope.$watch('ContentCtrl.connection.db', function (db, prev) {
        if (db && db !== prev) {
          _this.connection.table = null;
          _this.rows = [];
        }
      });

      $scope.$watch('ContentCtrl.connection.table', function (table) {
        if (table && _this.connection) {
          var connection;
          var tableInfo;
          _this.processing = true;
          _this.connection.connect()
            .then(function (conn) {
              connection = conn;
              return _this.connection.tableInfo(_this.connection.db, table);
            })
            .then(function (t) {
              tableInfo = t;
              return r.db(_this.connection.db).table(table).limit(1000).coerceTo('ARRAY').run(connection);
            })
            .then(function (rows) {
              $timeout(function () {
                _this.rows = processRows(rows, tableInfo);
              });
            })
            .catch(function (err) {
              $log.error(err);
            })
            .error(function (err) {
              $log.error(err);
            })
            .finally(function () {
              _this.processing = false;
              if (connection) {
                return connection.close();
              }
            });
        }
      });

      $log.debug('End ContentController constructor');
    } catch (err) {
      $log.error(err);
      $log.error('Failed to instantiate ContentController!');
      $location.path('500');
    }
  }
]);
