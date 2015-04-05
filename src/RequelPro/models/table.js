import store from '../services/store.js';

let currentTable = null;

let Table = store.defineResource({
  name: 'table',
  relations: {
    belongsTo: {
      connection: {
        localKey: 'connectionId',
        localField: 'connection'
      },
      database: {
        localKey: 'databaseId',
        localField: 'database'
      }
    }
  },
  afterInject() {
    Table.emit('change');
  },
  afterEject() {
    Table.emit('change');
  },
  afterUpdate(Table, table, cb) {
    Table.emit('change');
    cb(null, table);
  },
  afterCreate(Table, table, cb) {
    Table.set(table);
    cb(null, table);
  },
  current() {
    if (!currentTable) {
      currentTable = { id: 'none' };
    }
    return currentTable;
  },
  set(favorite) {
    currentTable = favorite;
    setTimeout(() => this.emit('table'));
    return currentTable;
  },
  unset() {
    currentTable = null;
    setTimeout(() => this.emit('table'));
  }
});

export default Table;
