/**
 * @doc function
 * @id DSNeDBAdapterProvider
 * @name DSNeDBAdapterProvider
 */
function DSNeDBAdapterProvider() {

  var mainPrefix = 'DSNeDBAdapter.';
  var errors = {
    INSERT: mainPrefix + 'INSERT(resourceName, attrs, cb): '
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

  this.$get = ['$q', '$log', 'DSUtils', 'DSErrors', 'NeDB', function ($q, $log, DSUtils, DSErrors, NeDB) {

    var IA = DSErrors.IA;
    var NER = DSErrors.NER;

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
       * @id DSNeDBAdapter.methods:GET
       * @name GET
       * @description
       * Wrapper for `$http.get()`.
       *
       * ## Signature:
       * ```js
       * DS.GET(url[, config])
       * ```
       *
       * ## Example:
       *
       * ```js
       * Works the same as $http.get()
       * ```
       *
       * @param {string} url The url of the request.
       * @param {object=} config Configuration for the request.
       * @returns {Promise} Promise produced by the `$q` service.
       */
//      GET: GET,

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
       * @id DSNeDBAdapter.methods:PUT
       * @name PUT
       * @description
       * Wrapper for `$http.put()`.
       *
       * ## Signature:
       * ```js
       * DS.PUT(url[, attrs][, config])
       * ```
       *
       * ## Example:
       *
       * ```js
       * Works the same as $http.put()
       * ```
       *
       * @param {string} url The url of the request.
       * @param {object=} attrs Request payload.
       * @param {object=} config Configuration for the request.
       * @returns {Promise} Promise produced by the `$q` service.
       */
//      PUT: PUT,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:DEL
       * @name DEL
       * @description
       * Wrapper for `$http.delete()`.
       *
       * ## Signature:
       * ```js
       * DS.DEL(url[, config])
       * ```
       *
       * ## Example:
       *
       * ```js
       * Works the same as $http.delete
       * ```
       *
       * @param {string} url The url of the request.
       * @param {object} config Configuration for the request.
       * @returns {Promise} Promise produced by the `$q` service.
       */
//      DEL: DEL,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:find
       * @name find
       * @description
       * Retrieve a single entity from the server.
       *
       * Sends a `GET` request to `:baseUrl/:endpoint/:id`.
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {string|number} id The primary key of the entity to retrieve.
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.get`.
       * @returns {Promise} Promise.
       */
//      find: find,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:findAll
       * @name findAll
       * @description
       * Retrieve a collection of entities from the server.
       *
       * Sends a `GET` request to `:baseUrl/:endpoint`.
       *
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {object=} params Search query parameters. See the [query guide](/documentation/guide/queries/index).
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.get`.
       * @returns {Promise} Promise.
       */
//      findAll: findAll,

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
       * Update an entity on the server.
       *
       * Sends a `PUT` request to `:baseUrl/:endpoint/:id`.
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {string|number} id The primary key of the entity to update.
       * @param {object} attrs The attributes with which to update the entity. See the [query guide](/documentation/guide/queries/index).
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.put`.
       * @returns {Promise} Promise.
       */
//      update: update,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:updateAll
       * @name updateAll
       * @description
       * Update a collection of entities on the server.
       *
       * Sends a `PUT` request to `:baseUrl/:endpoint`.
       *
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {object=} params Search query parameters. See the [query guide](/documentation/guide/queries/index).
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.put`.
       * @returns {Promise} Promise.
       */
//      updateAll: updateAll,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:destroy
       * @name destroy
       * @description
       * destroy an entity on the server.
       *
       * Sends a `PUT` request to `:baseUrl/:endpoint/:id`.
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {string|number} id The primary key of the entity to destroy.
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.delete`.
       * @returns {Promise} Promise.
       */
//      destroy: destroy,

      /**
       * @doc method
       * @id DSNeDBAdapter.methods:destroyAll
       * @name destroyAll
       * @description
       * Retrieve a collection of entities from the server.
       *
       * Sends a `DELETE` request to `:baseUrl/:endpoint`.
       *
       *
       * @param {object} resourceConfig Properties:
       * - `{string}` - `baseUrl` - Base url.
       * - `{string=}` - `endpoint` - Endpoint path for the resource.
       * @param {object=} params Search query parameters. See the [query guide](/documentation/guide/queries/index).
       * @param {object=} options Optional configuration. Refer to the documentation for `$http.delete`.
       * @returns {Promise} Promise.
       */
//      destroyAll: destroyAll
    };

    function HTTP(config) {
      var start = new Date().getTime();

      return $http(config).then(function (data) {
        $log.debug(data.config.method + ' request:' + data.config.url + ' Time taken: ' + (new Date().getTime() - start) + 'ms', arguments);
        return data;
      });
    }

    function GET(url, config) {
      config = config || {};
      return HTTP(DSUtils.deepMixIn(config, {
        url: url,
        method: 'GET'
      }));
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

    function PUT(url, attrs, config) {
      config = config || {};
      return HTTP(DSUtils.deepMixIn(config, {
        url: url,
        data: attrs,
        method: 'PUT'
      }));
    }

    function DEL(url, config) {
      config = config || {};
      return this.HTTP(DSUtils.deepMixIn(config, {
        url: url,
        method: 'DELETE'
      }));
    }

    function create(resourceConfig, attrs) {
      var deferred = $q.defer();
      this.INSERT(resourceConfig.name, attrs, function (err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
      return deferred.promise;
    }

    function destroy(resourceConfig, id, options) {
      options = options || {};
      return this.DEL(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint, id),
        options
      );
    }

    function destroyAll(resourceConfig, params, options) {
      options = options || {};
      options.params = options.params || {};
      if (params) {
        params = defaults.queryTransform(resourceConfig.name, params);
        DSUtils.deepMixIn(options.params, params);
      }
      return this.DEL(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint),
        options
      );
    }

    function find(resourceConfig, id, options) {
      options = options || {};
      return this.GET(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint, id),
        options
      );
    }

    function findAll(resourceConfig, params, options) {
      options = options || {};
      options.params = options.params || {};
      if (params) {
        params = defaults.queryTransform(resourceConfig.name, params);
        DSUtils.deepMixIn(options.params, params);
      }
      return this.GET(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint),
        options
      );
    }

    function update(resourceConfig, id, attrs, options) {
      options = options || {};
      return this.PUT(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint, id),
        attrs,
        options
      );
    }

    function updateAll(resourceConfig, attrs, params, options) {
      options = options || {};
      options.params = options.params || {};
      if (params) {
        params = defaults.queryTransform(resourceConfig.name, params);
        DSUtils.deepMixIn(options.params, params);
      }
      return this.PUT(
        DSUtils.makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint),
        attrs,
        options
      );
    }
  }];
}

module.exports = DSNeDBAdapterProvider;
