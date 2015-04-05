import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';
import styles from './databases.scss';

let Navbar = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    let connection = Connection.current();
    return {
      connection,
      databases: Database.filter({ connectionId: connection.id })
    };
  },
  componentDidMount() {
    Connection.on('connect', this.onChange);
    Database.on('change', this.onChange);
  },
  componentWillUnmount() {
    Connection.off('connect', this.onChange);
    Database.off('change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    let connection = Connection.current();
    let databases = Database.filter({ connectionId: connection.id });
    if (!this.state.connection !== connection || (!this.state.databases.length && databases.length)) {
      Database.set(databases[0]);
    }
    this.setState({
      connection,
      databases
    });
  },
  onSelect(e) {
    let db = e.target.value;
    this.setState({ db });
    Database.set(Database.get(db));
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
                <select value={this.state.db} onChange={this.onSelect}>
                {this.state.databases.map(database => {
                  return <option key={database.id} value={database.id}>{database.id}</option>;
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

export default Navbar;
