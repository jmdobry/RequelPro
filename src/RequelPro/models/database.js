import store from '../services/store.js';
import alert from '../services/alert.js';
import Table from '../models/table.js';

let currentDatabase = null;

let Database = store.defineResource({
  name: 'database',
  relations: {
    belongsTo: {
      connection: {
        localKey: 'connectionId',
        localField: 'connection'
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
  current() {
    if (!currentDatabase) {
      currentDatabase = { id: 'none' };
    }
    return currentDatabase;
  },
  set(database) {
    currentDatabase = database;
    setTimeout(() => this.emit('db'));
    let connection = store.definitions.connection.get(currentDatabase.connectionId);
    if (connection) {
      connection.getTables(currentDatabase.id)
        .then(tables => {
          Table.ejectAll({
            connectionId: connection.id,
            databaseId: currentDatabase.id
          });
          return Table.inject(tables.map(table => {
            return {
              id: table,
              databaseId: currentDatabase.id,
              connectionId: connection.id
            };
          }));
        })
        .catch(err => alert.error('Failed to retrieve tables!', err));
    }
    return currentDatabase;
  },
  unset() {
    currentDatabase = null;
    setTimeout(() => this.emit('db'));
  }
});

export default Database;
