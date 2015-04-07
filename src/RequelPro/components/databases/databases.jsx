import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import styles from './databases.scss';

let getData = params => {
  let connection = null;
  if (params.id) {
    connection = Connection.get(params.id);
  }
  return {
    connection,
    databases: connection ? Database.filter({ connectionId: connection.id }) : []
  };
};

let Databases = React.createClass({
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
    Connection.on('change', this.onChange);
    Database.on('change', this.onChange);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Database.off('change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
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
  /*
   * Methods
   */
  render() {
    return (
      <div id="databases">
        <form>
          <div className="row">
            <div className="medium-offset-1 medium-10 columns">
              <label>Databases
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
