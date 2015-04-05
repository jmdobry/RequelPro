import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import Table from '../../models/table.js';
import styles from './tables.scss';
import layout from '../../services/layout.js';

let Navbar = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    let connection = Connection.current();
    let database = Database.current();
    return {
      connection,
      database,
      table: Table.current(),
      tables: Table.filter({ databaseId: database.id, connectionId: connection.id })
    };
  },
  componentDidMount() {
    Connection.on('connect', this.onChange);
    Database.on('db', this.onChange);
    Table.on('change', this.onChange);
    layout.maximize('#tables');
  },
  componentWillUnmount() {
    Connection.off('connect', this.onChange);
    Database.off('db', this.onChange);
    Table.off('change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    let connection = Connection.current();
    let database = Database.current();
    this.setState({
      connection,
      database,
      tables: Table.filter({ databaseId: database.id, connectionId: connection.id })
    });
  },
  onSelect(table, e) {
    console.log(table);
    e.preventDefault();
    this.setState({ table });
    Table.set(table);
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="tables" className="panel">
        <h5>Tables</h5>
        <hr/>
        <ul className="side-nav">
        {this.state.tables.map(table => {
          return <li key={table.id} classNames={table === this.state.table ? 'active' : ''}>
            <a href="" onClick={e => this.onSelect(table, e)}>{table.id}</a>
          </li>;
        })}
        </ul>
      </div>
    );
  }
});

export default Navbar;
