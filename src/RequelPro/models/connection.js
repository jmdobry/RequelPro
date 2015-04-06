import store from '../services/store.js';
import gui from 'nw.gui';
import Datastore from 'nedb';
import r from 'rethinkdb';
import path from 'path';
import Database from './database.js';
import Table from './table.js';
import alert from '../services/alert.js';

let datapath = gui.App.dataPath + '/nedb';
let currentConnection = null;

let Connection = store.defineResource({
  name: 'connection',
  relations: {
    hasMany: {
      database: {
        foreignKey: 'connectionId',
        localField: 'databases'
      }
    }
  },
  afterInject() {
    Connection.emit('change');
  },
  afterEject() {
    Connection.emit('change');
  },
  afterUpdate() {
    Connection.emit('change');
  },
  methods: {
    tableInfo(db, table) {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          return r.db(db).table(table).info().run(conn);
        })
        .finally(() => {
          if (connection) {
            connection.close();
          }
        });
    },

    deleteTable(db, table) {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          return r.db(db).tableDrop(table).run(conn);
        })
        .finally(() => {
          if (connection) {
            return connection.close();
          }
        });
    },

    indexStatus(db, table, index) {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          if (index) {
            return r.db(db).table(table).indexStatus(index).run(conn);
          } else {
            return r.db(db).table(table).indexStatus().run(conn);
          }
        })
        .finally(() => {
          if (connection) {
            return connection.close();
          }
        });
    },

    connect() {
      let options = {
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
    },

    testConnection() {
      return this.connect().then(conn => {
        if (conn) {
          conn.close();
        }
      });
    },

    getTables(db) {
      let conn = null;
      return this.connect()
        .then(connection => {
          conn = connection;
          return r.db(db).tableList().run(conn);
        })
        .finally(() => {
          if (conn) {
            conn.close();
          }
        });
    },

    getDatabases() {
      let conn = null;
      return this.connect()
        .then(connection => {
          conn = connection;
          return r.dbList().run(conn);
        })
        .then(databases => {
          Database.ejectAll({
            connectionId: this.id
          });
          return Database.inject(databases.map(database => {
            return {
              id: database,
              connectionId: this.id
            };
          }));
        })
        .catch(err => alert.error('Failed to retrieve databases!', err))
        .finally(() => {
          if (conn) {
            conn.close();
          }
        });
    }
  },
  current() {
    return currentConnection || { id: 'none' };
  },
  set(connection) {
    if (currentConnection === connection) {
      return;
    }
    connection.section = currentConnection ? currentConnection.section || 'content' : 'content';
    currentConnection = connection;
    setTimeout(() => this.emit('connect'));
    if (Connection.is(currentConnection)) {
      currentConnection.getDatabases();
    }
    return currentConnection;
  },
  unset() {
    currentConnection = null;
    Table.unset();
    Database.unset();
    setTimeout(() => this.emit('connect'));
  }
});

Connection.db = new Datastore({
  filename: path.join(datapath, 'connection.db'),
  autoload: true,
  error: err => {
    console.error(err);
  }
});

export default Connection;
