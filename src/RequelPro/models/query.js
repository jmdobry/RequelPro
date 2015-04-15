import store from '../services/store.js';
import gui from 'nw.gui';
import Datastore from 'nedb';
import path from 'path';

let datapath = gui.App.dataPath + '/nedb';

let Query = store.defineResource({
  name: 'query',
  relations: {
    belongsTo: {
      connection: {
        localKey: 'connectionId',
        localField: 'connection'
      }
    }
  },
  /*
   * Lifecycle Hooks
   */
  afterInject() {
    Query.emit('change');
  },
  afterEject() {
    Query.emit('change');
  },
  /*
   * Instance Methods
   */
  methods: {}
});

Query.db = new Datastore({
  filename: path.join(datapath, 'query.db'),
  autoload: true,
  error: err => {
    console.error(err);
  }
});

export default Query;
