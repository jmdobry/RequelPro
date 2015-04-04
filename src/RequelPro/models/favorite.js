import store from '../services/store.js';
import gui from 'nw.gui';
import Datastore from 'nedb';
import path from 'path';

let datapath = gui.App.dataPath + '/nedb';
let currentFavorite = null;

let Favorite = store.defineResource({
  name: 'favorite',
  afterInject() {
    Favorite.emit('change');
  },
  afterEject() {
    Favorite.emit('change');
  },
  afterUpdate(Favorite, favorite, cb) {
    Favorite.emit('change');
    cb(null, favorite);
  },
  afterCreate(Favorite, favorite, cb) {
    Favorite.set(favorite);
    cb(null, favorite);
  },
  current() {
    if (!currentFavorite) {
      currentFavorite = {
        host: '',
        port: '',
        db: '',
        authKey: ''
      };
    }
    return currentFavorite;
  },
  set(favorite) {
    currentFavorite = !favorite ? null : favorite;
    setTimeout(() => this.emit('fav', currentFavorite));
    return currentFavorite;
  }
});

Favorite.db = new Datastore({
  filename: path.join(datapath, 'favorite.db'),
  autoload: true,
  error: err => {
    console.error(err);
  }
});

export default Favorite;
