import {Connection} from './connection'
import {Database} from './database'
import {Favorite} from './favorite'
import {Table} from './table'

export * from './connection'
export * from './database'
export * from './favorite'
export * from './table'

Connection.hasMany(Database, {
  foreignKey: 'connectionId',
  localField: 'databases'
})

Connection.hasMany(Table, {
  foreignKey: 'connectionId',
  localField: 'tables'
})

Database.belongsTo(Connection, {
  localKey: 'connectionId',
  localField: 'connection'
})

Database.hasMany(Table, {
  foreignKey: 'db',
  localField: 'tables'
})

Table.belongsTo(Connection, {
  localKey: 'connectionId',
  localField: 'connection'
})

Table.belongsTo(Database, {
  localKey: 'db',
  localField: 'database'
})
