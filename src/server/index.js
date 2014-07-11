var rethinkdbdash = require("rethinkdbdash");
var mout = require("mout");

var connections = [];
var defaults = {
  min: 1,
  bufferSize: 1,
  max: 10,
  db: "test",
  host: "localhost",
  port: 28015,
  authKey: ""
};

function connect(options) {
  var opts = mout.object.deepMixIn({}, defaults);
  options = options || {};
  mout.object.deepMixIn(opts, options);
  var r = rethinkdbdash(opts);
  var connection = {
    r: r
  };
  mout.object.deepMixIn(connection, opts);
  connections.push(connection);
  return connection;
}

function close(connection) {
  if (connection) {
    if (connection.r) {
      connection.r.getPool().drain();
    }
    mout.array.remove(connections, connection);
  }
}

module.exports = {
  connect: connect,
  close: close,
  connections: connections
};
