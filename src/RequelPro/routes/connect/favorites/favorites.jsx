import React from 'react';
import Favorite from '../../../models/favorite.js';

let Favorites = React.createClass({
  getInitialState() {
    // Pull the initial list of users
    // from Firebase
    Favorite.findAll();

    return {
      favorites: Favorite.getAll(),
      fav: Favorite.current()
    };
  },
  onChange() {
    this.setState({
      favorites: Favorite.getAll(),
      fav: Favorite.current()
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
  newConnection() {
    Favorite.unset();
  },
  selectFavorite(favorite, e) {
    e.preventDefault();
    e.stopPropagation();
    Favorite.set(favorite);
  },
  remove(favorite, e) {
    e.preventDefault();
    e.stopPropagation();
    Favorite.destroy(favorite);
    Favorite.unset();
  },
  render() {
    return (
      <div className="panel radius">
        <button className={'right button radius tiny' + (!this.state.fav.id ? ' disabled' : '')} onClick={this.newConnection}>
          <i className="fa fa-bolt"></i>
        &nbsp;Quick Connect
        </button>
        <h4>Favorites</h4>
        <hr/>
        <ul className="side-nav">
          {this.state.favorites.map(favorite => {
            return <li key={favorite.id} className={this.state.fav === favorite ? 'active' : '' }>
              <a key={favorite.id} href="" className="clearfix" onClick={e => this.selectFavorite(favorite, e)}>
                <span key={favorite.id} className="right button radius tiny alert" onClick={e => this.remove(favorite, e)}>
                  <i className="fa fa-trash-o">&nbsp;</i>
                </span>
                {favorite.name}&nbsp;
                <small>{favorite.host}:{favorite.port}</small>
              </a>
            </li>;
          })}
          <li className={this.state.favorites.length ? 'hide' : ''}>
            <h6>You have not added any favorites...</h6>
          </li>
        </ul>
      </div>
    );
  }
});

export default Favorites;
