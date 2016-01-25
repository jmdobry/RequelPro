import {Base} from './base'
import r from 'rethinkdb'
import _ from 'lodash'
import {Table} from './table'

export class Database extends Base {
  getTables() {
    const previous = Table.filter({
      db: this.id,
      connectionId: this.connectionId
    })
    return this.connection.run(
      r.db('rethinkdb')
        .table('table_config', { identifier_format: 'uuid' })
        .filter({ db: this.id })
        .eqJoin('id', r.db('rethinkdb').table('table_status', { identifier_format: 'uuid' }))
        .zip()
        .map(table => {
          return table.merge(r.db(this.name).table(table('name')).info().without('db'))
        })
        .map(table => {
          return table.merge({
            shards: table('shards').map(shard => {
              return shard.merge({
                replicas: shard('replicas').innerJoin(
                  r.db('rethinkdb')
                    .table('stats', { identifier_format: 'uuid' })
                    .filter(stat => stat('table').eq(table('id')).and(stat.hasFields('storage_engine')))
                    .without('id', 'table', 'db'),
                  (replicaRow, statRow) => replicaRow('server').eq(statRow('server'))
                ).zip()
                  .eqJoin('server', r.db('rethinkdb').table('server_status', { identifier_format: 'uuid' }))
                  .zip()
                  .coerceTo('array')
              })
            }).coerceTo('array'),
            indexes: r.db(this.name).table(table('name')).indexStatus().without('function').coerceTo('array')
          })
        })
        .coerceTo('array')
    ).then(tables => {
        tables.forEach(table => {
          table.connectionId = this.connectionId
        })
        const current = Table.inject(tables)
        const deleted = _.difference(previous, current)
        deleted.forEach(table => {
          Table.eject(table.id, { notify: false })
        })
        return current
      })
  }

  static afterInject () {
    this.emit('add')
  }

  static afterEject () {
    this.emit('remove')
  }

  static afterUpdate () {
    this.emit('add')
  }
}
