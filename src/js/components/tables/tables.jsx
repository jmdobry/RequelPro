import React from 'react'
import {Link} from 'react-router'
import classnames from 'classnames'
import _ from 'lodash'
import {Database, Table} from '../../models'
import styles from './tables.scss'
import {layout} from '../../services'

const tableRoutes = [
  'structure',
  'content',
  'relations',
  'info',
  'query'
]

export const Tables = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState () {
    return this.getState()
  },
  componentDidMount () {
    Table.on('change', this.onChange)
    Database.on('change', this.onChange)
    Table.on('add', this.onChange)
    Database.on('add', this.onChange)
    Table.on('remove', this.onChange)
    Database.on('remove', this.onChange)
    layout.maximize('#tables')
  },
  componentWillUnmount () {
    Table.off('change', this.onChange)
    Database.off('change', this.onChange)
    Table.off('add', this.onChange)
    Database.off('add', this.onChange)
    Table.off('remove', this.onChange)
    Database.off('remove', this.onChange)
  },
  componentWillReceiveProps () {
    this.onChange()
  },
  /*
   * Event Handlers
   */
  onChange () {
    this.setState(this.getState())
  },
  onSelect (table, e) {
    e.preventDefault();
    const params = this.context.router.getCurrentParams();
    if (params.tableId !== table.id) {
      let newRouteName = 'content';
      const currentRoutes = this.context.router.getCurrentRoutes();
      if (currentRoutes.length === 3) {
        const route = currentRoutes[2]
        if (_.includes(tableRoutes, route.name)) {
          newRouteName = route.name
        }
      }
      this.context.router.transitionTo(newRouteName, {
        id: table.connectionId,
        databaseId: table.db,
        tableId: table.id
      });
    }
  },
  /*
   * Methods
   */
  getState () {
    let params = this.context.router.getCurrentParams()
    let table = null
    let database = null
    if (params.tableId) {
      table = Database.get(params.tableId)
    }
    if (params.databaseId) {
      database = Database.get(params.databaseId)
    }
    let tables = database ? Table.filter({
      db: database.id,
      connectionId: database.connectionId,
      orderBy: [
        ['name', 'ASC']
      ]
    }) : []
    return {
      database,
      table,
      tables: tables
    }
  },
  render() {
    let params = this.context.router.getCurrentParams()
    return (
      <div id="tables" className="panel">
        <h5>Tables</h5>
        <hr/>
        <ul className="side-nav">
        {this.state.tables.map(table => {
          return <li key={table.id} className={table.id === params.tableId ? 'active' : ''}>
            <a href="" onClick={e => this.onSelect(table, e)}>{table.name}</a>
          </li>;
        })}
        </ul>
      </div>
    )
  }
})
