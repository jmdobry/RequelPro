import store from '../services/store.js';
import r from 'rethinkdb';
import _ from 'lodash';
import guid from 'mout/random/guid';
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

    getTables(db) {
      return this.run(r.db(db).tableList());
    },

    getDatabases() {
      let existing = Database.filter({ connectionId: this.id });
      let toKeep = [];
      return this.run(r.dbList()).then(databases => {
        let injected = Database.inject(databases.map(db => {
          let database = _.find(existing, d => d.name === db);
          if (database) {
            toKeep.push(database.id);
            return database;
          } else {
            return {
              id: guid(),
              name: db,
              connectionId: this.id
            };
          }
        }));
        // remove from the store databases and tables that no longer exist
        if (toKeep.length) {
          let ejected = Database.ejectAll({
            where: {
              id: {
                'notIn': toKeep
              }
            }
          }, { notify: false });
          ejected.forEach(db => {
            Table.ejectAll({ databaseId: db }, { notify: false });
          });
        }
        return injected;
      });
    }
  }
});

export default Connection;
