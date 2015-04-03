import React from 'react';
import classnames from 'classnames';
import Favorite from '../../../models/favorite.js';

let Favorites = React.createClass({
  getInitialState() {
    // Pull the initial list of users
    // from Firebase
    Favorite.findAll();

    return {
      favorites: Favorite.getAll(),
      fav: {},
      newFav: {}
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
  newConnection() {
    this.setState({
      newFav: {
        host: '',
        port: '',
        db: '',
        authKey: ''
      }
    });
    this.setState({
      fav: this.newFav
    });
  },
  render: function () {
    let newConnectionClassNames = classnames({
      active: !this.state.fav.id,
      hide: !this.state.favorites.length
    });
    return (
      <div className="panel">
        <h3>Favorites</h3>
        <ul>
          <li className={newConnectionClassNames} onClick={this.newConnection}>
            <h4>
              <i className="fa fa-plus"></i>
            New Connection
            </h4>

            <p>
            {this.state.newFav.host || '127.0.0.1'}:{this.state.newFav.port || 28015}
            </p>
          </li>
          <li class="list-group-item" data-ng-class="{ active: ConnectCtrl.fav.id === fav.id }"
            data-ng-repeat="fav in ConnectCtrl.favorites track by fav.id"
            data-ng-click="ConnectCtrl.fav = fav">
            <h4 class="list-group-item-heading">
              <span class="pull-right text-danger" data-ng-click="ConnectCtrl.remove(fav)">
                <i class="fa fa-trash-o">&nbsp;</i>
              </span>
            fav.name
            </h4>

            <p class="list-group-item-text">
            fav.host:fav.port
            </p>
          </li>
          <li class="list-group-item" data-ng-if="!ConnectCtrl.favorites.length">
            <h4 class="list-group-item-heading">
            You have not added any favorites...
            </h4>
          </li>
        </ul>
      </div>
    );
  }
});

export default Favorites;
