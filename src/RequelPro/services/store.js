import JSData from 'js-data';
import DSNeDBAdapter from './DSNeDBAdapter.jsx';

let store = new JSData.DS({
  reapInterval: false,
  log: false
});

store.registerAdapter('nedb', new DSNeDBAdapter(), { default: true });

export default store;
