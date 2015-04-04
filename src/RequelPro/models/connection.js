import store from '../services/store.js';
import gui from 'nw.gui';
import Datastore from 'nedb';
import r from 'rethinkdb';
import path from 'path';

let datapath = gui.App.dataPath + '/nedb';
let currentConnection = null;

let Connection = store.defineResource({
  name: 'connection',
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
    dbList() {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          return r.dbList().run(conn);
        })
        .finally(() => {
          if (connection) {
            return connection.close();
          }
        });
    },

    tableList(db) {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          return r.db(db).tableList().run(conn);
        })
        .finally(() => {
          if (connection) {
            return connection.close();
          }
        });
    },

    tableInfo(db, table) {
      let connection = null;
      return this.connect()
        .then(conn => {
          connection = conn;
          return r.db(db).table(table).info().run(conn);
        })
        .finally(() => {
          if (connection) {
            return connection.close();
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
    }
  },
  current() {
    return currentConnection || { id: 'none' };
  },
  set(connection) {
    currentConnection = !connection ? null : connection;
    setTimeout(() => this.emit('connect', currentConnection));
    return currentConnection;
  },
  testConnection(options) {
    let connection = this.createInstance(options);
    return connection.connect().then(conn => {
      if (conn) {
        conn.close();
      }
    });
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
