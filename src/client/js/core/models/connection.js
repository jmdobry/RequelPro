angular.module('RequelPro').service('Connection', ['gui', 'NeDB', 'DS', '$log', 'path', function (gui, NeDB, DS, $log, path) {
  $log.debug('creating Connection resource');

  var Datastore = require('nedb');
  var datapath = gui.App.dataPath + '/nedb';

  $log.debug('nedb datapath:', datapath);

  NeDB.connection = new Datastore({
    filename: path.join(datapath, 'connection.db'),
    autoload: true,
    error: function (err) {
      $log.error(err);
    }
  });

  return DS.defineResource({
    name: 'connection',
    methods: require(process.cwd() + '/server/models/Connection.js')
  });
}]);
