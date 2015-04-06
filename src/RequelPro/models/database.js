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
    if (currentDatabase === database) {
      return;
    }
    currentDatabase = database;
    setTimeout(() => this.emit('db'));
    let connection = store.definitions.connection.get(currentDatabase.connectionId);
    let connectionId = connection.id;
    let databaseId = currentDatabase.id;
    if (connection && connectionId !== 'none' && currentDatabase && databaseId !== 'none') {
      connection.getTables(databaseId)
        .then(tables => {
          Table.ejectAll({
            connectionId: connectionId
          });
          return Table.inject(tables.map(table => {
            return {
              id: table,
              databaseId: databaseId,
              connectionId: connectionId
            };
          }));
        })
        .catch(err => alert.error('Failed to retrieve tables!', err));
    }
    return currentDatabase;
  },
  unset() {
    Table.unset();
    currentDatabase = null;
    setTimeout(() => this.emit('db'));
  }
});

export default Database;
