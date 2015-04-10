import r from 'rethinkdb';
import _ from 'lodash';
import store from '../services/store.js';
import Table from './table.js';

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
        foreignKey: 'db',
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
      let previous = Table.filter({ db: this.id, connectionId: this.connectionId });
      return this.connection.run(
        r.db('rethinkdb')
          .table('table_config', { identifier_format: 'uuid' })
          .filter({ db: this.id })
          .eqJoin('id', r.db('rethinkdb').table('table_status', { identifier_format: 'uuid' }))
          .zip()
          .map(table => {
            return table.merge(r.db(this.name).table(table('name')).info().without('db'));
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
                });
              }).coerceTo('array'),
              indexes: r.db(this.name).table(table('name')).indexStatus().without('function').coerceTo('array')
            });
          })
          .coerceTo('array')
      ).then(tables => {
          tables.forEach(table => {
            table.connectionId = this.connectionId;
          });
          let current = Table.inject(tables);
          let deleted = _.difference(previous, current);
          deleted.forEach(table => {
            Table.eject(table.id, { notify: false });
          });
          return current;
        });
    }
  }
});

export default Database;
