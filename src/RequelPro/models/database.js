import r from 'rethinkdb';
import _ from 'lodash';
import guid from 'mout/random/guid';
import store from '../services/store.js';
import Table from '../models/table.js';

let Database = store.defineResource({
  name: 'database',
  relations: {
    belongsTo: {
      connection: {
        localKey: 'connectionId',
        localField: 'connection'
      }
    },
    hasMany: {
      table: {
        foreignKey: 'databaseId',
        localField: 'tables'
      }
    }
  },
  afterInject() {
    Database.emit('change');
  },
  afterEject() {
    Database.emit('change');
  },
  afterUpdate(Database, database, cb) {
    Database.emit('change');
    cb(null, database);
  },
  afterCreate(Database, database, cb) {
    Database.set(database);
    cb(null, database);
  },
  /*
   * Instance Methods
   */
  methods: {
    getTables() {
      let existing = Table.filter({ databaseId: this.id, connectionId: this.connection.id });
      let toKeep = [];
      return this.connection.run(r.db(this.name).tableList()).then(tables => {
        let injected = Table.inject(tables.map(t => {
          let table = _.find(existing, _t => _t.name === t);
          if (table) {
            toKeep.push(table.id);
            return table;
          } else {
            return {
              id: guid(),
              name: t,
              databaseId: this.id,
              connectionId: this.connection.id
            };
          }
        }));
        // remove from the store tables that no longer exist
        if (toKeep.length) {
          Table.ejectAll({
            where: {
              id: {
                'notIn': toKeep
              }
            }
          }, { notify: false });
        }
        return injected;
      });
    }
  }
});

console.log('RETURN DATABASE MODEL');
export default Database;
