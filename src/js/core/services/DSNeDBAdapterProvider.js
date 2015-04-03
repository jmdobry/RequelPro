/**
 * @doc function
 * @id DSNeDBAdapterProvider
 * @name DSNeDBAdapterProvider
 */
function DSNeDBAdapterProvider() {

  var mainPrefix = 'DSNeDBAdapter.';
  var errors = {
    INSERT: mainPrefix + 'INSERT(resourceName, attrs, cb): ',
    UPDATE: mainPrefix + 'UPDATE(resourceName, query, attrs, options, cb): ',
    REMOVE: mainPrefix + 'REMOVE(resourceName, query, options, cb): ',
    FINDONE: mainPrefix + 'FINDONE(resourceName, primaryKey, cb): ',
    FIND: mainPrefix + 'FIND(resourceName, query, cb): '
  };

  /**
   * @doc property
   * @id DSNeDBAdapterProvider.properties:defaults
   * @name defaults
   * @description
   * Default configuration for this adapter.
   *
   * Properties:
   *
   * - `{function}` - `queryTransform` - See [the guide](/documentation/guide/adapters/index). Default: No-op.
   */
  var defaults = this.defaults = {
    /**
     * @doc property
     * @id DSNeDBAdapterProvider.properties:defaults.queryTransform
     * @name defaults.queryTransform
     * @description
     * Transform the angular-data query to something your server understands. You might just do this on the server instead.
     *
     * @param {string} resourceName The name of the resource.
     * @param {object} params Params sent through from `$http()`.
     * @returns {*} Returns `params` as-is.
     */
    queryTransform: function (resourceName, params) {
      return params;
    }
  };

  this.$get = ['$q', 'DSUtils', 'DSErrors', 'NeDB', function ($q, DSUtils, DSErrors, NeDB) {

    var IA = DSErrors.IA;
    var NER = DSErrors.NER;

    function FINDONE(resourceName, query, cb) {
      if (!DSUtils.isFunction(cb)) {
        throw new IA('cb: Must be a function!');
      }
      if (!(resourceName in NeDB)) {
        return cb(new NER(errors.FINDONE + resourceName));
      } else if (!DSUtils.isObject(query)) {
        return cb(new IA('query: Must be an object!'));
      } else {
        NeDB[resourceName].findOne(query, function (err, doc) {
          if (err) {
            return cb(err);
          } else if (!doc) {
            return cb(new Error('Not Found'));
          } else {
            return cb(null, doc);
          }
        });
      }
    }

    function FIND(resourceName, query, cb) {
      query = query || {};
      if (!DSUtils.isFunction(cb)) {
        throw new IA('cb: Must be a function!');
      }
      if (!(resourceName in NeDB)) {
        return cb(new NER(errors.FIND + resourceName));
      } else if (!DSUtils.isObject(query)) {
        return cb(new IA('query: Must be an object!'));
      } else {
        NeDB[resourceName].find(query, cb);
      }
    }

    function INSERT(resourceName, attrs, cb) {
      if (!DSUtils.isFunction(cb)) {
        throw new IA('cb: Must be a function!');
      }
      if (!(resourceName in NeDB)) {
        return cb(new NER(errors.INSERT + resourceName));
      } else if (!DSUtils.isObject(attrs)) {
        return cb(new IA('attrs: Must be an object!'));
      } else {
        NeDB[resourceName].insert(attrs, cb);
      }
    }

    function UPDATE(resourceName, query, attrs, options, cb) {
      options = options || {};
      if (!DSUtils.isFunction(cb)) {
        throw new IA('cb: Must be a function!');
      }
      if (!(resourceName in NeDB)) {
        return cb(new NER(errors.UPDATE + resourceName));
      } else if (!DSUtils.isObject(query)) {
        return cb(new IA('query: Must be an object!'));
      } else if (!DSUtils.isObject(attrs)) {
        return cb(new IA('attrs: Must be an object!'));
      } else if (!DSUtils.isObject(options)) {
        return cb(new IA('options: Must be an object!'));
      } else {
        NeDB[resourceName].update(query, attrs, options, cb);
      }
    }

    function REMOVE(resourceName, query, options, cb) {
      options = options || {};
      if (!DSUtils.isFunction(cb)) {
        throw new IA('cb: Must be a function!');
      }
      if (!(resourceName in NeDB)) {
        return cb(new NER(errors.REMOVE + resourceName));
      } else if (!DSUtils.isObject(query)) {
        return cb(new IA('query: Must be an object!'));
      } else if (!DSUtils.isObject(options)) {
        return cb(new IA('options: Must be an object!'));
      } else {
        NeDB[resourceName].remove(query, options, cb);
      }
    }

    function create(resourceConfig, attrs) {
      var deferred = $q.defer();
      if (resourceConfig && resourceConfig.idAttribute in attrs) {
        attrs._id = attrs[resourceConfig.idAttribute];
      }
      INSERT(resourceConfig.name, attrs, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          if (resourceConfig.idAttribute) {
            var a = {
              $set: {}
            };
            a.$set[resourceConfig.idAttribute] = doc._id;
            UPDATE(resourceConfig.name, { _id: doc._id }, a, {}, function (err) {
              if (err) {
                REMOVE(resourceConfig.name, { _id: doc._id }, function () {
                  deferred.reject(err);
                });
              } else {
                doc[resourceConfig.idAttribute] = doc._id;
                deferred.resolve(doc);
              }
            });
          } else {
            deferred.resolve(doc);
          }
        }
      });
      return deferred.promise;
    }

    function destroy(resourceConfig, id) {
      var deferred = $q.defer();
      this.REMOVE(resourceConfig.name, {
        _id: id
      }, {}, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
      return deferred.promise;
    }

    function destroyAll(resourceConfig, params, options) {
      params = params || {};
      options = options || {};
      options.multi = true;
      params = defaults.queryTransform(resourceConfig.name, params);
      var deferred = $q.defer();
      this.REMOVE(resourceConfig.name, params, options, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
      return deferred.promise;
    }

    function find(resourceConfig, id) {
      var deferred = $q.defer();
      var options = {};
      options[resourceConfig.idAttribute || '_id'] = id;
      this.FINDONE(resourceConfig.name, options, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
      return deferred.promise;
    }

    function findAll(resourceConfig, params) {
      params = params || {};
      params = defaults.queryTransform(resourceConfig.name, params);
      var deferred = $q.defer();
      this.FIND(resourceConfig.name, params, function (err, docs) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(docs);
        }
      });
      return deferred.promise;
    }

    function update(resourceConfig, id, attrs) {
      var _this = this;
      if (resourceConfig && resourceConfig.idAttribute) {
        delete attrs[resourceConfig.idAttribute];
      }
      delete attrs._id;
      var deferred = $q.defer();
      this.UPDATE(resourceConfig.name, {
        _id: id
      }, { $set: attrs }, {}, function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          _this.find(resourceConfig, id).then(function (doc) {
            if (angular.isObject(doc)) {
              deferred.resolve(doc);
            } else {
              deferred.reject(new Error('Not Found'));
            }
          }, deferred.reject);
        }
      });
      return deferred.promise;
    }

    function updateAll(resourceConfig, attrs, params, options) {
      if (resourceConfig && resourceConfig.idAttribute) {
        delete attrs[resourceConfig.idAttribute];
      }
      delete attrs._id;
      params = params || {};
      options = options || {};
      options.multi = true;
      params = defaults.queryTransform(resourceConfig.name, params);
      var deferred = $q.defer();
      this.UPDATE(resourceConfig.name, params, attrs, options, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
      return deferred.promise;
    }

    /**
     * @doc interface
     * @id DSNeDBAdapter
     * @name DSNeDBAdapter
     * @description
     * Default adapter used by angular-data. This adapter uses AJAX and JSON to send/retrieve data to/from a server.
     * Developers may provide custom adapters that implement the adapter interface.
     */
    return {
      /**
       * @doc property
       * @id DSNeDBAdapter.properties:defaults
       * @name defaults
       * @description
       * Reference to [DSNeDBAdapterProvider.defaults](/documentation/api/api/DSNeDBAdapterProvider.properties:defaults).
       */
      defaults: defaults,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:FINDONE
       * @name FINDONE
       * @description
       * Wrapper for `Datastore#findOne(query, cb)`.
       *
       * ## Signature:
       * ```js
       * DSNeDBAdapter.FINDONE(resourceName, query, cb)
       * ```
       *
       * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
       * @param {object} query The primaryKey query.
       * @param {function} cb Callback function.
       */
      FINDONE: FINDONE,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:FIND
       * @name FIND
       * @description
       * Wrapper for `Datastore#find(query, cb)`.
       *
       * ## Signature:
       * ```js
       * DSNeDBAdapter.FIND(resourceName, query, cb)
       * ```
       *
       * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
       * @param {object} query Search query parameters.
       * @param {function} cb Callback function.
       */
      FIND: FIND,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:INSERT
       * @name INSERT
       * @description
       * Wrapper for `Datastore#insert(attrs, cb)`.
       *
       * ## Signature:
       * ```js
       * DSNeDBAdapter.INSERT(resourceName, attrs, cb)
       * ```
       *
       * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
       * @param {object} attrs Attributes of item to be created.
       * @param {function} cb Callback function.
       */
      INSERT: INSERT,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:UPDATE
       * @name UPDATE
       * @description
       * Wrapper for `Datastore#update(query, attrs, options, cb)`.
       *
       * ## Signature:
       * ```js
       * DSNeDBAdapter.UPDATE(resourceName, query, attrs, options, cb)
       * ```
       *
       * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
       * @param {object} query Query for selecting document(s) to be updated.
       * @param {object} attrs Attributes of item to be created.
       * @param {object} options Configuration options.
       * @param {function} cb Callback function.
       */
      UPDATE: UPDATE,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:REMOVE
       * @name REMOVE
       * @description
       * Wrapper for `Datastore#remove(query, options, cb)`.
       *
       * ## Signature:
       * ```js
       * DSNeDBAdapter.REMOVE(resourceName, query, options, cb)
       * ```
       *
       * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
       * @param {object} query Query for selecting document(s) to be removed.
       * @param {object} options Configuration options.
       * @param {function} cb Callback function.
       */
      REMOVE: REMOVE,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:find
       * @name find
       * @description
       * Retrieve a single entity from a NeDB Datastore.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       * - `{string}` - `idAttribute` - The field to be used as the primary key.
       *
       * @param {string|number} id The primary key of the entity to retrieve.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      find: find,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:findAll
       * @name findAll
       * @description
       * Retrieve a collection of entities from a NeDB Datastore.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       *
       * @param {object=} params Search query parameters.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      findAll: findAll,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:create
       * @name create
       * @description
       * Create a new entity in a NeDB Datastore.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       * - `{string}` - `idAttribute` - The field to use as the primary key.
       *
       * @param {object} attrs Attributes of item to be created.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      create: create,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:update
       * @name update
       * @description
       * Update an entity in a NeDB Datastore.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       * - `{string}` - `idAttribute` - The field to use as the primary key.
       *
       * @param {string|number} id The primary key of the entity to update.
       * @param {object} attrs The attributes with which to update the entity.
       * @param {object=} options Optional configuration.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      update: update,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:updateAll
       * @name updateAll
       * @description
       * Update a collection of entities in a NeDB Datastore.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       * - `{string}` - `idAttribute` - The field to use as the primary key.
       *
       * @param {object=} params Search query parameters.
       * @param {object=} options Optional configuration.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      updateAll: updateAll,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:destroy
       * @name destroy
       * @description
       * destroy an entity on the server.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       *
       * @param {string|number} id The primary key of the entity to destroy.
       * @param {object=} options Optional configuration.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      destroy: destroy,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:destroyAll
       * @name destroyAll
       * @description
       * Retrieve a collection of entities from the server.
       *
       * @param {object} resourceConfig Properties:
       *
       * - `{string}` - `name` - The resource type, e.g. 'user', 'comment', etc.
       *
       * @param {object=} params Search query parameters.
       * @param {object=} options Optional configuration.
       * @returns {Promise} Promise produced by the `$q` service.
       */
      destroyAll: destroyAll
    };
  }];
}

angular.module('RequelPro').provider('DSNeDBAdapter', DSNeDBAdapterProvider);
