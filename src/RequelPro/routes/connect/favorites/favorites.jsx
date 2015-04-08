import React from 'react';
import Favorite from '../../../models/favorite.js';
import layout from '../../../services/layout.js';
import styles from './favorites.scss';

let Favorites = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    Favorite.findAll();
    return { favorites: Favorite.getAll() };
  },
  componentDidMount() {
    Favorite.on('change', this.onChange);
    layout.maximize('#favorites');
  },
  componentWillUnmount() {
    Favorite.off('change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState({ favorites: Favorite.getAll() });
  },
  onSelectFavorite(favorite, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChange(favorite);
    this.setState({ favorite });
  },
  onNewConnection() {
    this.props.onChange();
    this.setState({ favorite: null });
  },
  onRemove(favorite, e) {
    e.preventDefault();
    e.stopPropagation();
    Favorite.destroy(favorite);
    this.onNewConnection();
  },
  /*
   * Methods
   */
  render() {
    return (
      <div className="panel" id="favorites">
        <button className={'right button radius tiny' + (!this.state.favorite ? ' disabled' : '')} onClick={this.onNewConnection}>
          <i className="fa fa-bolt"></i>
        &nbsp;New Connection
        </button>
        <h4>Favorites</h4>
        <hr/>
        <ul className="side-nav">
          {this.state.favorites.map(favorite => {
            return <li key={favorite.id} className={this.state.favorite === favorite ? 'active' : '' }>
              <a key={favorite.id} href="" className="clearfix" onClick={e => this.onSelectFavorite(favorite, e)}>
                <span key={favorite.id} className="right button radius tiny alert" onClick={e => this.onRemove(favorite, e)}
                  title="Delete favorite">
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
