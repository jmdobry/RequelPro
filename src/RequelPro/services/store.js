import JSData from 'js-data';
import DSNeDBAdapter from './DSNeDBAdapter.jsx';

let store = new JSData.DS({
  reapInterval: false,
  log: true
});

store.registerAdapter('nedb', new DSNeDBAdapter(), { default: true });

export default store;
