import styles from './connect.scss';
import React from 'react';
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
    this.setState({ favorites: Favorite.getAll() });
  },
  componentDidMount() {
    Favorite.on('change', this.onChange);
  },
  componentWillUnmount() {
    Favorite.off('change', this.onChange);
  },
  render: function () {
    return (
      <div id="connectPage">
        <div className="row">
          <div className="large-4 large-offset-2 columns">
            <Favorites/>
          </div>
          <div className="large-4 columns end">
            <form name="connectForm" id="connectForm" className="panel">
              <h3>Connection Details</h3>
              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-bookmark"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="name this connection..." id="name" name="name"/>
                </div>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-database"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="127.0.0.1" id="host" name="host"/>
                </div>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-anchor"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="text" placeholder="28015" id="port" name="port"/>
                </div>
              </div>

              <div className="row collapse">
                <div className="small-3 large-1 columns">
                  <span className="prefix">
                    <i className="fa fa-key"></i>
                  </span>
                </div>
                <div className="small-10 large-11 columns">
                  <input type="password" id="authKey" name="authKey"/>
                </div>
              </div>

              <div className="row">
                <button type="button" className="button small" onClick={this.testConnection}>Test Connection</button>
                <button type="button" className="button small success" onClick={this.save}>
                  {this.state.fav.id || this.state.processing ? 'Save' : 'Save to Favorites'}
                </button>
                <button type="submit" className="button small success">Connect</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export default Connect;
