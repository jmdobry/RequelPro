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
    return { connections: Connection.getAll() };
  },
  componentDidMount() {
    Connection.on('change', this.onChange);
    Connection.on('closeTab', this.onCloseTab);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('closeTab', this.onCloseTab);
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState({ connections: Connection.getAll() });
  },
  onClick(connection, e) {
    e.preventDefault();
    e.stopPropagation();
    this.context.router.transitionTo('connection', connection);
  },
  onCloseTab() {
    let params = this.context.router.getCurrentParams();
    if (params.id) {
      this.remove(Connection.get(params.id));
    }
  },
  onRemoveClick(connection, e) {
    e.preventDefault();
    e.stopPropagation();
    Table.ejectAll({ connectionId: connection.id });
    Database.ejectAll({ connectionId: connection.id });
    Connection.eject(connection.id);
    let connections = Connection.getAll();
    if (connections.length) {
      this.context.router.transitionTo('connection', connection);
    } else {
      Connection.ejectAll();
      Table.ejectAll();
      Database.ejectAll();
      this.context.router.transitionTo('/');
    }
  },
  onNewConnectionClick() {
    this.context.router.transitionTo('/');
  },
  /*
   * Methods
   */
  render() {
    let dlClasses = 'sub-nav';
    if (!this.state.connections.length) {
      dlClasses += ' hidden';
    }
    let params = this.context.router.getCurrentParams();
    return (
      <dl className={dlClasses}>
      {this.state.connections.map(connection => {
        return <dd key={connection.id} className={params.id === connection.id ? 'active' : ''}>
          <a href="" onClick={e => this.onClick(connection, e)}>
            <span>{connection.host + '/' + (connection.name ? connection.name : connection.port)}</span>
            <span className="right delete-tab" onClick={e => this.onRemoveClick(connection, e)}>
              <i className="fa fa-close"></i>
            </span>
          </a>
        </dd>;
      })}
        <dd>
          <a href="#" onClick={this.onNewConnectionClick} id="navtab-plus">
            <i className="fa fa-plus"></i>
          &nbsp;New
          </a>
        </dd>
      </dl>
    );
  }
});

export default Navtabs;
