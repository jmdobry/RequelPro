var r = require('rethinkdb');
var conn;

function getBody(fn) {
  var entire = fn.toString();
  return entire.substring(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
}

var expr = r.expr(Function(getBody(function () {
  return 1;
}))).build();

console.log(Function(getBody(function () {
  return 1;
})).toString());
console.log(expr.toString());
console.log(JSON.stringify(expr, null, 2));

r.connect().then(function (connection) {
  conn = connection;
  return r.db('rethinkdb')
          .table('table_config')
          .map(function (table) {
           return table;
          })
          .coerceTo('array')
          .run(connection);
}).catch(function (err) {
  console.error(err);
}).finally(function () {
  if (conn) {
    conn.close();
  }
});
