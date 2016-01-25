import {Base} from './base'
import Datastore from 'nedb'
import {app} from 'remote'
import path from 'path'
import {DSNeDBAdapter} from '../services'

const datapath = app.getPath('userData')

export class Favorite extends Base {
  static db = new Datastore({
    filename: path.join(datapath, 'favorite.db'),
    autoload: true,
    error: err => {
      console.error(err)
    }
  })
}

Favorite.registerAdapter('nedb', new DSNeDBAdapter(), { default: true })
