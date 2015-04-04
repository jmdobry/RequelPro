import {DSUtils} from 'js-data';
let {Promise: P,isObject,deepMixIn} = DSUtils;

class Defaults {
  queryTransform(resourceConfig, params) {
    return params;
  }
}

class DSNeDBAdapter {
  constructor(options) {
    options = options || {};
    this.defaults = new Defaults();
    deepMixIn(this.defaults, options);
  }

  FINDONE(resourceConfig, query) {
    return new P((resolve, reject) => {
      resourceConfig.db.findOne(query, (err, doc) => {
        if (err) {
          reject(err);
        } else if (!doc) {
          new Error('Not Found');
        } else {
          resolve(doc);
        }
      });
    });
  }

  FIND(resourceConfig, query) {
    query = query || {};
    return new P((resolve, reject) => {
      resourceConfig.db.find(query, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  INSERT(resourceConfig, attrs) {
    return new P((resolve, reject) => {
      resourceConfig.db.insert(attrs, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  UPDATE(resourceConfig, query, attrs, options) {
    options = options || {};
    return new P((resolve, reject) => {
      resourceConfig.db.update(query, attrs, options, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  REMOVE(resourceConfig, query, options) {
    options = options || {};
    return new P((resolve, reject) => {
      resourceConfig.db.remove(query, options, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  create(resourceConfig, attrs) {
    if (resourceConfig && resourceConfig.idAttribute in attrs) {
      attrs._id = attrs[resourceConfig.idAttribute];
    }
    return this.INSERT(resourceConfig, attrs).then(doc => {
      if (resourceConfig.idAttribute) {
        let a = {
          $set: {}
        };
        a.$set[resourceConfig.idAttribute] = doc._id;
        return this.UPDATE(resourceConfig, { _id: doc._id }, a, {}).then(() => {
          doc[resourceConfig.idAttribute] = doc._id;
          return doc;
        }).catch(err => {
          return this.REMOVE(resourceConfig, { _id: doc._id }).then(() => {
            return P.reject(err);
          });
        });
      } else {
        return doc;
      }
    });
  }

  destroy(resourceConfig, id) {
    return this.REMOVE(resourceConfig, {
      _id: id
    }, {});
  }

  destroyAll(resourceConfig, params, options) {
    params = params || {};
    options = options || {};
    options.multi = true;
    params = this.defaults.queryTransform(resourceConfig, params);
    return this.REMOVE(resourceConfig, params, options);
  }

  find(resourceConfig, id) {
    let options = {};
    options[resourceConfig.idAttribute || '_id'] = id;
    return this.FINDONE(resourceConfig, options);
  }

  findAll(resourceConfig, params) {
    params = params || {};
    params = this.defaults.queryTransform(resourceConfig, params);
    return this.FIND(resourceConfig, params);
  }

  update(resourceConfig, id, attrs) {
    if (resourceConfig && resourceConfig.idAttribute) {
      delete attrs[resourceConfig.idAttribute];
    }
    delete attrs._id;
    return this.UPDATE(resourceConfig, {
      _id: id
    }, { $set: attrs }, {}).then(() => {
      return this.find(resourceConfig, id);
    }).then(doc => {
      if (!isObject(doc)) {
        throw new Error('Not Found!');
      } else {
        return doc;
      }
    });
  }

  updateAll(resourceConfig, attrs, params, options) {
    if (resourceConfig && resourceConfig.idAttribute) {
      delete attrs[resourceConfig.idAttribute];
    }
    delete attrs._id;
    params = params || {};
    options = options || {};
    options.multi = true;
    params = this.defaults.queryTransform(resourceConfig, params);
    return this.UPDATE(resourceConfig, params, attrs, options);
  }
}

export default DSNeDBAdapter;
