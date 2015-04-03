import store from '../services/store.js';
import gui from 'nw.gui';
import Datastore from 'nedb';
import r from 'rethinkdb';
import path from 'path';

let datapath = gui.App.dataPath + '/nedb';

store.connection = new Datastore({
  filename: path.join(datapath, 'connection.db'),
  autoload: true,
  error: function (err) {
    console.error(err);
  }
});

let Connection = store.defineResource({
  name: 'connection',
  methods: {
    dbList() {
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

    tableList(db) {
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

    tableInfo(db, table) {
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

    deleteTable(db, table) {
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

    indexStatus(db, table, index) {
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

    connect() {
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
    }
  }
});

export default Connection;
