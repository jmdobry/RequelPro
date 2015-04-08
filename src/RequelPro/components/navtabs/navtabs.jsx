import React from 'react';
import _ from 'lodash';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import styles from './navtabs.scss';

let Navtabs = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return this.getState();
  },
  componentDidMount() {
    Connection.on('change', this.onChange);
    Connection.on('closeTab', this.onCloseTab);
    Connection.on('goTo', this.onClick);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('closeTab', this.onCloseTab);
    Connection.off('goTo', this.onClick);
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getState());
  },
  onClick(connection, e) {
    console.log('onClick', connection, e);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let databases = Database.filter({ connectionId: connection.id });
    let database = _.find(databases, db => db.id === connection.db);
    database = database ? database : databases.length ? databases[0] : null;
    if (database) {
      // go to default db
      this.context.router.transitionTo('database', {
        id: connection.id,
        databaseId: database.id
      });
      database.getTables();
    } else {
      // go to database selection
      this.context.router.transitionTo('connection', connection);
    }
  },
  onCloseTab() {
    let params = this.context.router.getCurrentParams();
    if (params.id) {
      this.onRemoveClick(Connection.get(params.id));
    }
  },
  onRemoveClick(connection, e) {
    e.preventDefault();
    e.stopPropagation();
    Connection.eject(connection.id);
    let connections = Connection.getAll();
    if (connections.length) {
      this.context.router.transitionTo('connection', connections[0]);
    } else {
      Connection.ejectAll();
      this.context.router.transitionTo('/');
    }
  },
  onNewConnectionClick() {
    this.context.router.transitionTo('/');
  },
  /*
   * Methods
   */
  getState() {
    return { connections: Connection.getAll() };
  },
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
