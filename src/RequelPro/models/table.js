import r from 'rethinkdb';
import _ from 'lodash';
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
  methods: {
    getData(options) {
      let connection = store.definitions.connection.current();
      let database = store.definitions.database.current();
      let conn = null;
      return connection.connect()
        .then(_conn => {
          conn = _conn;
          let rql = r.db(database.id).table(this.id);
          try {
            console.log(options);
            if (options.field) {
              let clause = r.row(options.field).default(null);
              let {operator,value} = options;
              if (_.isFinite(parseInt(value, 10))) {
                value = parseInt(value, 10);
              }
              console.log(value);
              if (operator === '==') {
                clause = clause.eq(value);
              } else if (operator === '!=') {
                clause = clause.ne(value);
              } else if (operator === '>') {
                clause = clause.gt(value);
              } else if (operator === '<') {
                clause = clause.lt(value);
              } else if (operator === '>=') {
                clause = clause.ge(value);
              } else if (operator === '<=') {
                clause = clause.le(value);
              } else if (operator === 'in') {
                clause = r.expr(value).contains(clause);
              } else if (operator === 'is null') {
                clause = clause.eq(null);
              }
              rql = rql.filter(clause);
            }
            if (options.sort) {
              if (options.direction === 'desc') {
                rql = rql.orderBy(r.desc(options.sort));
              } else {
                rql = rql.orderBy(options.sort);
              }
            }
          } catch (err) {
            console.log(err.stack);
          }
          return rql.limit(100).coerceTo('ARRAY').run(conn);
        })
        .finally(() => {
          if (conn) {
            return conn.close();
          }
        });
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
  set(table) {
    if (currentTable === table) {
      return;
    }
    currentTable = table;
    setTimeout(() => this.emit('table'));
    return currentTable;
  },
  unset() {
    currentTable = null;
    setTimeout(() => this.emit('table'));
  }
});

export default Table;
