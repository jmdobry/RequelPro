import {Base} from './base'
import r from 'rethinkdb'
import _ from 'lodash'
import {Database} from './database'
import {Table} from './table'

export class Connection extends Base {
  connect () {
    const options = {
      host: this.host || '127.0.0.1',
      port: this.port || 28015
    }

    if (this.authKey) {
      options.authKey = this.authKey
    }

    if (this.db) {
      options.db = this.db
    }

    return r.connect(options)
  }

  run(rql) {
    let conn = null
    return this.connect()
      .then(connection => {
        conn = connection
        return rql.run(conn)
      })
      .finally(() => conn ? conn.close() : null)
  }

  testConnection() {
    return this.connect().then(conn => {
      if (conn) {
        conn.close()
      }
    });
  }

  tableInfo(db, table) {
    return this.run(r.db(db).table(table).info())
  }

  deleteTable(db, table) {
    return this.run(r.db(db).tableDrop(table))
  }

  getDatabases() {
    const previous = Database.filter({ connectionId: this.id })
    return this.run(r.db('rethinkdb').table('db_config').coerceTo('array')).then(databases => {
      databases.forEach(db => {
        db.connectionId = this.id
      });
      const current = Database.inject(databases)
      const deleted = _.difference(previous, current)
      deleted.forEach(db => {
        Table.ejectAll({ db: db.id }, { notify: false })
        Database.eject(db.id, { notify: false })
      });
      return current
    })
  }

  static afterInject () {
    this.emit('change')
  }

  static beforeEject (id) {
    Table.ejectAll({ connectionId: id })
    Database.ejectAll({ connectionId: id })
  }

  static afterEject() {
    this.emit('change')
  }

  static afterUpdate(...args) {
    this.emit('change')
    super.afterUpdate(...args)
  }
}
