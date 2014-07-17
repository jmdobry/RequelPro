var r = require('rethinkdb');

//var defaults = {
//  min: 1,
//  bufferSize: 1,
//  max: 10,
//  db: 'test',
//  host: 'localhost',
//  port: 28015,
//  authKey: '
//};

//function connect(options) {
//  var opts = mout.object.deepMixIn({}, defaults);
//  options = options || {};
//  mout.object.deepMixIn(opts, options);
//  var r = rethinkdbdash(opts);
//  var connection = {
//    r: r
//  };
//  mout.object.deepMixIn(connection, opts);
//  connections.push(connection);
//  return connection;
//}
//
//function close(connection) {
//  if (connection) {
//    if (connection.r) {
//      connection.r.getPool().drain();
//    }
//    mout.array.remove(connections, connection);
//  }
//}

module.exports = {
//  connect: connect,
  dbList: function () {
    var connection;
    return this.connect()
      .then(function (conn) {
        connection = conn;
        return r.dbList().run(conn);
      })
      .finally(function () {
        if (connection) {
          return connection.close();
        }
      });
  },

  tableList: function (db) {
    var connection;
    return this.connect()
      .then(function (conn) {
        connection = conn;
        return r.db(db).tableList().run(conn);
      })
      .finally(function () {
        if (connection) {
          return connection.close();
        }
      });
  },

  tableInfo: function (db, table) {
    var connection;
    return this.connect()
      .then(function (conn) {
        connection = conn;
        return r.db(db).table(table).info().run(conn);
      })
      .finally(function () {
        if (connection) {
          return connection.close();
        }
      });
  },

  deleteTable: function (db, table) {
    var connection;
    return this.connect()
      .then(function (conn) {
        connection = conn;
        return r.db(db).tableDrop(table).run(conn);
      })
      .finally(function () {
        if (connection) {
          return connection.close();
        }
      });
  },

  indexStatus: function (db, table, index) {
    var connection;
    return this.connect()
      .then(function (conn) {
        connection = conn;
        if (index) {
          return r.db(db).table(table).indexStatus(index).run(conn);
        } else {
          return r.db(db).table(table).indexStatus().run(conn);
        }
      })
      .finally(function () {
        if (connection) {
          return connection.close();
        }
      });
  },

  connect: function () {
    var options = {
      host: this.host || '127.0.0.1',
      port: this.port || 28015
    };

    if (this.authKey) {
      options.authKey = this.authKey;
    }

    if (this.db) {
      options.db = this.db;
    }

    return r.connect(options);
  }//,
//  close: close
};
