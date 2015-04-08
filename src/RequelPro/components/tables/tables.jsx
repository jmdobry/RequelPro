import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Database from '../../models/database.js';
import Table from '../../models/table.js';
import styles from './tables.scss';
import layout from '../../services/layout.js';

let getData = params => {
  let table = null;
  let database = null;
  if (params.tableId) {
    table = Database.get(params.tableId);
  }
  if (params.databaseId) {
    database = Database.get(params.databaseId);
  }
  return {
    database,
    table,
    tables: database ? Table.filter({ databaseId: database.id, connectionId: database.connectionId }) : []
  };
};

let Tables = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return getData(this.context.router.getCurrentParams());
  },
  componentDidMount() {
    Table.on('change', this.onChange);
    Database.on('change', this.onChange);
    layout.maximize('#tables');
  },
  componentWillUnmount() {
    Table.off('change', this.onChange);
    Database.off('change', this.onChange);
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
  },
  onSelect(table, e) {
    e.preventDefault();
    let params = this.context.router.getCurrentParams();
    if (params.tableId !== table.id) {
      this.context.router.transitionTo('structure', {
        id: table.connectionId,
        databaseId: table.databaseId,
        tableId: table.id
      });
    }
  },
  /*
   * Methods
   */
  render() {
    let params = this.context.router.getCurrentParams();
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
    );
  }
});

export default Tables;
