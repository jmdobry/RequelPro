import styles from './connect.scss';
import React from 'react';
import $ from 'jQuery';
import sweetalert from 'sweetalert';
import Connection from '../../models/connection.js';
import Favorite from '../../models/favorite.js';
import Favorites from './favorites/favorites.jsx';

let Connect = React.createClass({
  getInitialState() {
    // Pull the initial list of users
    // from Firebase
    Favorite.findAll();

    return {
      favorites: Favorite.getAll(),
      fav: {}
    };
  },
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
  componentDidMount() {
    Favorite.on('change', this.onChange);
    Favorite.on('fav', this.onChange);
  },
  componentWillUnmount() {
    Favorite.off('change', this.onChange);
    Favorite.off('fav', this.onChange);
  },
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
      Favorite.create(this.getValues());
    }
  },
  onNameChange(e, n) {
    let name = n || e.target.value;
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
  testConnection() {
    Connection.testConnection(this.getValues())
      .then(() => {
        sweetalert({
          type: 'success',
          title: 'Connection established!',
          confirmButtonColor: '#1fa589',
          confirmButtonText: 'Okay'
        });
      })
      .catch(err => {
        sweetalert({
          type: 'error',
          title: 'Failed to connect!',
          text: err.msg || err,
          confirmButtonColor: '#f65b4f',
          confirmButtonText: 'Okay'
        });
      });
  },
  render() {
    return (
      <div id="connectPage">
        <div className="row">
          <div className="large-4 large-offset-2 columns">
            <Favorites/>
          </div>
          <div className="large-4 columns end">
            <form name="connectForm" id="connectForm" className="panel" onSubmit={this.connect}>
              <h4>Connection Details</h4>
              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className={'prefix' + (this.state.nameError ? ' error' : '')}>
                    <i className="fa fa-bookmark"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="name this connection..." ref="name" value={this.state.name}
                    className={this.state.nameError ? 'error' : ''} onChange={this.onNameChange}/>
                </div>
                <small className={this.state.nameError ? 'error' : 'hide'}>{this.state.nameError}</small>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-database"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="127.0.0.1" ref="host" value={this.state.host} onChange={this.onHostChange}/>
                </div>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-anchor"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="28015" ref="port" value={this.state.port} onChange={this.onPortChange}/>
                </div>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-key"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="password" ref="authKey" value={this.state.authKey} onChange={this.onAuthKeyChange}/>
                </div>
              </div>
              <hr/>
              <ul className="button-group even-3">
                <li>
                  <button type="button" className="button tiny" onClick={this.save}>
                  {this.state.fav.id || this.state.processing ? 'Save' : 'Save to Favorites'}
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
