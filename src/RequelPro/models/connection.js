import store from '../services/store.js';
import r from 'rethinkdb';
import _ from 'lodash';
import Database from './database.js';
import Table from './table.js';

let Connection = store.defineResource({
  name: 'connection',
  relations: {
    hasMany: {
      database: {
        foreignKey: 'connectionId',
        localField: 'databases'
      },
      table: {
        foreignKey: 'connectionId',
        localField: 'tables'
      }
    }
  },
  /*
   * Lifecycle Hooks
   */
  afterInject() {
    Connection.emit('change');
  },
  beforeEject(Connection, connection) {
    Table.ejectAll({ connectionId: connection.id });
    Database.ejectAll({ connectionId: connection.id });
  },
  afterEject() {
    Connection.emit('change');
  },
  afterUpdate() {
    Connection.emit('change');
  },
  /*
   * Instance Methods
   */
  methods: {
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

    run(rql) {
      let conn = null;
      return this.connect()
        .then(connection => {
          conn = connection;
          return rql.run(conn);
        })
        .finally(() => conn ? conn.close() : null);
    },

    testConnection() {
      return this.connect().then(conn => {
        if (conn) {
          conn.close();
        }
      });
    },

    tableInfo(db, table) {
      return this.run(r.db(db).table(table).info());
    },

    deleteTable(db, table) {
      return this.run(r.db(db).tableDrop(table));
    },

    getDatabases() {
      let previous = Database.filter({ connectionId: this.id });
      return this.run(r.db('rethinkdb').table('db_config').coerceTo('array')).then(databases => {
        databases.forEach(db => {
          db.connectionId = this.id;
        });
        let current = Database.inject(databases);
        let deleted = _.difference(previous, current);
        deleted.forEach(db => {
          Table.ejectAll({ db: db.id }, { notify: false });
          Database.eject(db.id, { notify: false });
        });
        return current;
      });
    }
  }
});

export default Connection;
