import React from 'react';
import guid from 'mout/random/guid';
import store from '../../services/store.js';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import styles from './databases.scss';

let Databases = React.createClass({
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
    Database.on('change', this.onChange);
    // Event comes from main menu, or global shortcut
    Database.on('refresh', this.onRefresh);
    // Event comes from main menu or global shortcut
    Database.on('databaseInNewTab', this.onDatabaseInNewTab);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Database.off('change', this.onChange);
    Database.off('refresh', this.onRefresh);
    Database.off('databaseInNewTab', this.onDatabaseInNewTab);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getState());
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  onSelect(e) {
    let databaseId = e.target.value;
    let database = Database.get(databaseId);
    this.setState({ databaseId });
    let params = this.context.router.getCurrentParams();
    if (params.databaseId !== database.id) {
      database.getTables();
      this.context.router.transitionTo('database', {
        id: database.connectionId,
        databaseId
      });
    }
  },
  onRefresh() {
    let params = this.context.router.getCurrentParams();
    if (params.id) {
      let connection = Connection.get(params.id);
      connection.getDatabases();
    }
  },
  onDatabaseInNewTab() {
    let params = this.context.router.getCurrentParams();
    if (params.id) {
      let connection = Connection.get(params.id);
      let newConnection = Connection.createInstance(connection);
      newConnection.id = guid();

      store.store.connection.completedQueries[newConnection.id] = new Date().getTime();
      newConnection = Connection.inject(newConnection);
      newConnection.getDatabases().then(() => {
        Connection.emit('goTo', newConnection);
      });
    }
  },
  /*
   * Methods
   */
  getState() {
    let params = this.context.router.getCurrentParams();
    return {
      databases: Database.filter({
        connectionId: params.id,
        orderBy: [
          ['name', 'ASC']
        ]
      }),
      databaseId: params.databaseId
    };
  },
  render() {
    return (
      <div id="databases">
        <form>
          <div className="row">
            <div className="medium-offset-1 medium-10 columns">
              <label title="Select a database to view">Databases
                <select value={this.state.databaseId} onChange={this.onSelect} disabled={!this.state.databases.length}>
                {this.state.databases.map(database => {
                  return <option key={database.id} value={database.id}>{database.name}</option>;
                })}
                </select>
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Databases;
