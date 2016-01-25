import React from 'react'
import {Favorite} from '../../../models'
import {layout} from '../../../services'
import styles from './favorites.scss'

const FavoriteItem = React.createClass({
  onSelect (favorite, e) {
    e.preventDefault()
    e.stopPropagation()
    Favorite.emit('fav', favorite)
  },
  onRemove (favorite, e) {
    Favorite.destroy(favorite.id)
  },
  render () {
    const favorite = this.props.favorite
    return (
      <li key={favorite.id} className={this.props.active ? 'active' : '' }>
        <a key={favorite.id} href="" className="clearfix" onClick={e => this.onSelect(favorite, e)}>
          <span key={favorite.id} className="right button radius tiny alert" onClick={e => this.onRemove(favorite, e)}
            title="Delete favorite">
            <i className="fa fa-trash-o">&nbsp;</i>
          </span>
          <span className="favorite">{favorite.name}&nbsp;
            <small>{favorite.host}:{favorite.port}</small>
          </span>
        </a>
      </li>
    )
  }
})

export const Favorites = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    Favorite.findAll()
    return this.getData()
  },
  componentDidMount() {
    Favorite.on('add', this.onChange)
    Favorite.on('remove', this.onChange)
    layout.maximize('#favorites')
  },
  componentWillUnmount() {
    Favorite.off('add', this.onChange)
    Favorite.off('remove', this.onChange)
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getData())
  },
  onNewConnection() {
    Favorite.emit('fav')
  },
  /*
   * Methods
   */
  getData () {
    return {
      favorites: Favorite.getAll()
    }
  },
  render () {
    return (
      <div className="panel" id="favorites">
        <button id="newFav" className="right button radius tiny" onClick={this.onNewConnection}>
          <i className="fa fa-plus"></i>
        &nbsp;New
        </button>
        <h4>Favorites</h4>
        <hr/>
        <ul className="side-nav">
          {this.state.favorites.map(favorite => {
            return <FavoriteItem favorite={favorite} active={this.props.activeFav === favorite}/>
          })}
          <li className={this.state.favorites.length ? 'hide' : ''}>
            <h6>You have not added any favorites...</h6>
          </li>
        </ul>
      </div>
    );
  }
});
