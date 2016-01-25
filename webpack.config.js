var path= require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    './dist/app.js': './src/js/app.jsx',
  },
  output: {
    filename: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
    'lodash': 'commonjs lodash',
    'react': 'commonjs react',
    'react-router': 'commonjs react-router',
    'classnames': 'commonjs classnames',
    'mout/string/pascalCase': 'commonjs mout/string/pascalCase',
    'mout/random/guid': 'commonjs mout/random/guid',
    'js-data': 'commonjs js-data',
    'rethinkdb': 'commonjs rethinkdb',
    'remote': 'commonjs remote',
    'jQuery': 'commonjs jQuery',
    'sweetalert': 'commonjs sweetalert',
    'nedb': 'commonjs nedb',
    'util': 'commonjs util',
    'process': 'commonjs process',
    'path': 'commonjs path'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test')
        ],
        test: /\.jsx?$/,
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['syntax-async-functions', 'transform-regenerator']
        }
      },
      // load scss files using the sass, raw, and style loaders with the given import paths
      {
        test: /\.scss$/,
        loader: 'style!raw!sass?outputStyle=compressed&' +
        'includePaths[]=' +
        (path.resolve(__dirname, './node_modules/zurb-foundation/scss'))
      }
    ]
  }
}
