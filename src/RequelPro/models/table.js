import r from 'rethinkdb';
import _ from 'lodash';
import store from '../services/store.js';

let Table = store.defineResource({
  name: 'table',
  TABLE_PAGE_SIZE: 100,
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
  /*
   * Lifecycle Hooks
   */
  afterInject() {
    Table.emit('change');
  },
  afterEject() {
    Table.emit('change');
  },
  /*
   * Instance Methods
   */
  methods: {
    getData(options) {
      let connection = this.connection;
      // data query
      let rql = r.db(this.database.name).table(this.name);
      // count query
      let rql2 = null;
      if (options.field) {
        let clause = r.row(options.field).default(null);
        let {operator,value} = options;
        if (_.isFinite(parseInt(value, 10))) {
          value = parseInt(value, 10);
        }
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
          rql2 = rql.orderBy(r.desc(options.sort));
        } else {
          rql2 = rql.orderBy(options.sort);
        }
      }
      if (!rql2) {
        rql2 = rql;
      }
      return store.utils.Promise.all([
        // filtered, skipped, ordered and limited data
        connection.run(rql2.skip(Table.TABLE_PAGE_SIZE * (parseInt(options.page, 10) - 1)).limit(Table.TABLE_PAGE_SIZE).coerceTo('ARRAY')),
        // count query does not need the skip, orderBy, or limit
        connection.run(rql.count())
      ]).then(results => {
        return {
          data: results[0],
          count: results[1]
        };
      });
    },
    deleteRows(rows) {
      if (!_.isArray(rows)) {
        rows = [rows];
      }
      let connection = this.connection;
      let rql = r.db(this.database.name).table(this.id);
      return connection.run(rql.getAll.apply(rql, rows.map(row => {
        return row.id
      })).delete());
    }
  }
});

export default Table;
