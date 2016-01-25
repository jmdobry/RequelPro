import {Base} from './base'
import r from 'rethinkdb'
import _ from 'lodash'

export class Table extends Base {
  getStatus () {
    return this.connection.run(
      r.db('rethinkdb')
        .table('table_status', { identifier_format: 'uuid' })
        .get(this.id)
        .merge(r.db(this.database.name).table(r.row('name')).info().without('db'))
        .merge(table => {
          return {
            shards: table('shards').map(shard => {
              return shard.merge({
                replicas: shard('replicas').innerJoin(
                  r.db('rethinkdb')
                    .table('stats', { identifier_format: 'uuid' })
                    .filter(stat => stat('table').eq(table('id')).and(stat.hasFields('storage_engine')))
                    .without('id', 'table', 'db'),
                  (replicaRow, statRow) => {
                    return replicaRow('server').eq(statRow('server'));
                  }
                ).zip()
                  .eqJoin('server', r.db('rethinkdb').table('server_status', { identifier_format: 'uuid' }))
                  .zip()
                  .coerceTo('array')
              })
            }).coerceTo('array'),
            indexes: r.db(this.database.name).table(table('name')).indexStatus().without('function').coerceTo('array')
          }
        })
    ).then(table => Table.inject(table, { notify: false }))
  }

  getData (options) {
    const connection = this.connection
    // data query
    let rql = r.db(this.database.name).table(this.name)
    // count query
    let rql2 = null
    if (options.field) {
      let clause = r.row(options.field).default(null)
      let {operator,value} = options
      if (_.isFinite(parseInt(value, 10))) {
        value = parseInt(value, 10)
      }
      if (operator === '==') {
        clause = clause.eq(value)
      } else if (operator === '!=') {
        clause = clause.ne(value)
      } else if (operator === '>') {
        clause = clause.gt(value)
      } else if (operator === '<') {
        clause = clause.lt(value)
      } else if (operator === '>=') {
        clause = clause.ge(value)
      } else if (operator === '<=') {
        clause = clause.le(value)
      } else if (operator === 'in') {
        clause = r.expr(value).contains(clause)
      } else if (operator === 'is null') {
        clause = clause.eq(null)
      }
      rql = rql.filter(clause)
    }
    if (options.sort) {
      if (options.direction === 'desc') {
        rql2 = rql.orderBy(r.desc(options.sort))
      } else {
        rql2 = rql.orderBy(options.sort)
      }
    }
    if (!rql2) {
      rql2 = rql
    }
    return Promise.all([
      // filtered, skipped, ordered and limited data
      connection.run(rql2.skip(Table.TABLE_PAGE_SIZE * (parseInt(options.page, 10) - 1)).limit(Table.TABLE_PAGE_SIZE).coerceTo('ARRAY')),
      // count query does not need the skip, orderBy, or limit
      connection.run(rql.count())
    ]).then(results => {
      return {
        data: results[0],
        count: results[1]
      }
    })
  }

  deleteRows (rows) {
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    const connection = this.connection
    const rql = r.db(this.database.name).table(this.id)
    return connection.run(rql.getAll.apply(rql, rows.map(row => {
      return row.id
    })).delete())
  }

  getFieldsAndTypes () {
    return this.connection.run(
      r.do(r.db(this.database.name).table(this.name).sample(500).coerceTo('array'), rows => {
        return rows.concatMap(_row => _row.keys())
          .distinct()
          .map(field => {
            return {
              name: field,
              types: rows.group(_row => _row(field).default(null).typeOf()).count().ungroup().coerceTo('array')
            }
          })
      })
    );
  }

  static TABLE_PAGE_SIZE = 100

  static afterInject () {
    this.emit('change')
  }

  static afterEject () {
    this.emit('change')
  }
}
