import JSData from 'js-data';
import DSNeDBAdapter from './DSNeDBAdapter.jsx';

let store = new JSData.DS();

store.registerAdapter('nedb', new DSNeDBAdapter(), { default: true });

export default store;
