import React from 'react';
import guid from 'mout/random/guid';
import alert from '../../services/alert.js';
import Connection from '../../models/connection.js';
import store from '../../services/store.js';
import Favorite from '../../models/favorite.js';
import Favorites from './favorites/favorites.jsx';
import styles from './connect.scss';

let Connect = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return {};
  },
  /*
   * Event Handlers
   */
  onNameChange(e, n) {
    let name = n || n === '' ? n : e.target.value;
    if (!name) {
      this.setState({
        nameError: 'Name is required!',
        name
      });
    } else {
      this.setState({
        nameError: null,
        name
      });
    }
    return name;
  },
  onHostChange(e) {
    this.setState({ host: e.target.value });
  },
  onPortChange(e) {
    this.setState({ port: e.target.value });
  },
  onAuthKeyChange(e) {
    this.setState({ authKey: e.target.value });
  },
  onDbChange(e) {
    this.setState({ db: e.target.value });
  },
  onSelectFavorite(favorite) {
    this.setState({
      name: favorite ? favorite.name : null,
      host: favorite ? favorite.host : null,
      port: favorite ? favorite.port : null,
      authKey: favorite ? favorite.authKey : null,
      db: favorite ? favorite.db : null,
      favorite: favorite ? favorite : null
    });
  },
  /*
   * Methods
   */
  getValues() {
    return {
      name: React.findDOMNode(this.refs.name).value,
      host: React.findDOMNode(this.refs.host).value,
      port: React.findDOMNode(this.refs.port).value,
      authKey: React.findDOMNode(this.refs.authKey).value,
      db: React.findDOMNode(this.refs.db).value
    };
  },
  save(e) {
    e.preventDefault();
    let name = this.onNameChange(null, React.findDOMNode(this.refs.name).value);
    if (!name) {
      return;
    }
    if (this.state.favorite) {
      Favorite.update(this.state.favorite.id, this.getValues());
    } else {
      let options = this.getValues();
      options.host = options.host || '127.0.0.1';
      options.port = options.port || 28015;
      options.authKey = options.authKey || '';
      options.db = options.db || '';
      Favorite.create(options);
    }
  },
  testConnection() {
    let connection = Connection.createInstance(this.getValues());
    connection.testConnection()
      .then(() => alert.success('Connection established!'))
      .catch(err => alert.error('Failed to connect!', err));
  },
  connect(e) {
    e.preventDefault();
    e.stopPropagation();
    let connection = Connection.createInstance(this.getValues());

    connection.host = connection.host || '127.0.0.1';
    connection.port = connection.port || 28015;
    connection.db = connection.db || 'test';

    // Make sure we can connect to the database
    connection.testConnection()
      .then(() => {
        // Create a connection and add it to the store
        connection.id = guid();
        store.store.connection.completedQueries[connection.id] = new Date().getTime();
        connection = Connection.inject(connection);

        // Clear the current favorite
        this.onSelectFavorite();
        return connection.getDatabases();
      }, err => alert.error('Failed to connect!', err))
      .then(databases => {
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
      }, err => alert.error('Failed to retrieve databases!', err))
      .catch(err => alert.error('Uh Oh! Something went wrong...', err));
  },
  render() {
    return (
      <div id="connectPage">
        <div className="row">
          <div className="large-3 medium-4 columns">
            <Favorites onChange={this.onSelectFavorite}/>
          </div>
          <div className="large-5 large-offset-2 medium-4 medium-offset-1 columns end">
            <form name="connectForm" id="connectForm" className="panel radius" onSubmit={this.connect}>
              <h4>Connection Details</h4>
              <hr/>
              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className={'prefix' + (this.state.nameError ? ' error' : '')}>
                        <i className="fa fa-bookmark"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns">
                      <input type="text" placeholder="name this connection..." ref="name" value={this.state.name}
                        className={this.state.nameError ? 'error' : ''} onChange={this.onNameChange}/>
                    </div>
                    <small className={this.state.nameError ? 'error' : 'hide'}>{this.state.nameError}</small>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix" title="Default database">
                        <i className="fa fa-database"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns end">
                      <input type="text" placeholder="test" ref="db" value={this.state.db} onChange={this.onDbChange}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix" title="Hostname of server. Default is 127.0.0.1">
                        <i className="fa fa-server"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns end">
                      <input type="text" placeholder="127.0.0.1" ref="host" value={this.state.host} onChange={this.onHostChange}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix" title="Connection port. Default is 28015">
                        <i className="fa fa-anchor"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns end">
                      <input type="text" placeholder="28015" ref="port" value={this.state.port} onChange={this.onPortChange}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix" title="Server authKey. Default is no key">
                        <i className="fa fa-key"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns end">
                      <input type="password" ref="authKey" value={this.state.authKey} onChange={this.onAuthKeyChange}/>
                    </div>
                  </div>
                </div>
              </div>
              <hr/>
              <ul className="button-group even-3 radius">
                <li>
                  <button type="button" className="button tiny" onClick={this.save}>
                  {this.state.favorite ? 'Save' : 'Save to Favorites'}
                  </button>
                </li>
                <li>
                  <button type="button" className="button tiny" onClick={this.testConnection}>Test Connection</button>
                </li>
                <li>
                  <button type="submit" className="button tiny success">Connect</button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export default Connect;
