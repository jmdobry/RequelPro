import React from 'react';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import Table from '../../models/table.js';
import styles from './navtabs.scss';

let Navtabs = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return {
      connection: Connection.current(),
      connections: Connection.getAll()
    };
  },
  componentDidMount() {
    Connection.on('change', this.onChange);
    Connection.on('connect', this.onChange);
    Connection.on('closeTab', this.closeTab);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('connect', this.onChange);
    Connection.off('closeTab', this.closeTab);
  },
  /*
   * Event Handlers
   */
  onChange() {
    let connection = Connection.current();
    if (connection && (!this.state.connection || this.state.connection.id !== connection.id) && connection.id !== 'none') {
      this.context.router.transitionTo('content', connection);
    }
    this.setState({
      connection: connection,
      connections: Connection.getAll()
    });
  },
  onClick(connection, e) {
    e.preventDefault();
    e.stopPropagation();
    Connection.set(connection);
  },
  closeTab() {
    if (this.state.connection && this.state.connection.id !== 'none') {
      this.remove(this.state.connection);
    }
  },
  /*
   * Methods
   */
  remove(connection, e) {
    e.preventDefault();
    e.stopPropagation();
    Table.ejectAll({ connectionId: connection.id });
    Database.ejectAll({ connectionId: connection.id });
    Connection.eject(connection.id);
    let connections = Connection.getAll();
    if (connections.length) {
      Connection.set(connections[0]);
    } else {
      Connection.unset();
      Table.ejectAll();
      Database.ejectAll();
      this.context.router.transitionTo('/');
    }
  },
  newConnection() {
    Connection.unset();
    this.context.router.transitionTo('/');
  },
  render() {
    let dlClasses = 'sub-nav';
    if (!this.state.connections.length) {
      dlClasses += ' hidden';
    }
    return (
      <dl className={dlClasses}>
      {this.state.connections.map(connection => {
        return <dd key={connection.id} className={connection === this.state.connection ? 'active' : ''}>
          <a href="#" onClick={e => this.onClick(connection, e)}>
            <span>{connection.host + '/' + (connection.name ? connection.name : connection.port)}</span>
            <span className="right delete-tab" onClick={e => this.remove(connection, e)}>
              <i className="fa fa-close"></i>
            </span>
          </a>
        </dd>;
      })}
        <dd>
          <a href="#" onClick={this.newConnection} id="navtab-plus">
            <i className="fa fa-plus"></i>
          &nbsp;New
          </a>
        </dd>
      </dl>
    );
  }
});

export default Navtabs;
