import styles from './connect.scss';
import React from 'react';
import guid from 'mout/random/guid';
import alert from '../../services/alert.js';
import Connection from '../../models/connection.js';
import store from '../../services/store.js';
import Favorite from '../../models/favorite.js';
import Favorites from './favorites/favorites.jsx';

let Connect = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    // Pull the initial list of users
    // from Firebase
    Favorite.findAll();

    return {
      favorites: Favorite.getAll(),
      fav: {}
    };
  },
  componentDidMount() {
    Favorite.on('change', this.onChange);
    Favorite.on('fav', this.onChange);
  },
  componentWillUnmount() {
    Favorite.off('change', this.onChange);
    Favorite.off('fav', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    let fav = Favorite.current();
    this.setState({
      fav,
      name: fav.name,
      host: fav.host,
      port: fav.port,
      authKey: fav.authKey
    });
  },
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
  /*
   * Methods
   */
  getValues() {
    return {
      name: React.findDOMNode(this.refs.name).value,
      host: React.findDOMNode(this.refs.host).value,
      port: React.findDOMNode(this.refs.port).value,
      authKey: React.findDOMNode(this.refs.authKey).value
    };
  },
  save(e) {
    e.preventDefault();
    let name = this.onNameChange(null, React.findDOMNode(this.refs.name).value);
    if (!name) {
      return;
    }
    if (this.state.fav && this.state.fav.id) {
      Favorite.update(this.state.fav.id, this.getValues());
    } else {
      let options = this.getValues();
      options.host = options.host || '127.0.0.1';
      options.port = options.port || 28015;
      options.authKey = options.authKey || '';
      Favorite.create(options);
    }
  },
  testConnection() {
    Connection.testConnection(this.getValues())
      .then(() => alert.success('Connection established!'))
      .catch(err => alert.error('Failed to connect!', err));
  },
  connect(e) {
    e.preventDefault();
    e.stopPropagation();
    let connection = Connection.createInstance(this.getValues());

    connection.host = connection.host || '127.0.0.1';
    connection.port = connection.port || 28015;

    connection.connect()
      .then(conn => {
        if (conn) {
          conn.close();
        }
        connection.id = guid();
        store.store.connection.completedQueries[connection.id] = new Date().getTime();
        Connection.set(Connection.inject(connection));
        Favorite.unset();
      })
      .catch(err => alert.error('Failed to connect!', err));
  },
  render() {
    return (
      <div id="connectPage">
        <div className="row">
          <div className="large-3 medium-4 columns">
            <Favorites/>
          </div>
          <div className="large-4 large-offset-1 medium-6 columns end">
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
                      <span className="prefix">
                        <i className="fa fa-database"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns">
                      <input type="text" placeholder="127.0.0.1" ref="host" value={this.state.host} onChange={this.onHostChange}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix">
                        <i className="fa fa-anchor"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns">
                      <input type="text" placeholder="28015" ref="port" value={this.state.port} onChange={this.onPortChange}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="medium-12 columns">
                  <div className="row collapse prefix-radius">
                    <div className="medium-1 columns">
                      <span className="prefix">
                        <i className="fa fa-key"></i>
                      </span>
                    </div>
                    <div className="medium-11 columns">
                      <input type="password" ref="authKey" value={this.state.authKey} onChange={this.onAuthKeyChange}/>
                    </div>
                  </div>
                </div>
              </div>
              <hr/>
              <ul className="button-group even-3 radius">
                <li>
                  <button type="button" className="button tiny" onClick={this.save}>
                  {this.state.fav.id ? 'Save' : 'Save to Favorites'}
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
