angular.module('RequelPro').service('Favorite', ['NeDB', 'DS', 'path', '$log', function (NeDB, DS, path, $log) {
  $log.debug('Setting up nedb for Favorite resource');

  var Datastore = require('nedb');
  var datapath = gui.App.dataPath + '/nedb';

  $log.debug('nedb datapath:', datapath);

  NeDB.favorite = new Datastore({
    filename: path.join(datapath, 'favorite.db'),
    autoload: true,
    error: function (err) {
      $log.error(err);
    }
  });

  $log.debug('Creating Favorite resource');

  return DS.defineResource({
    name: 'favorite',
    methods: {}
  });
}]);
