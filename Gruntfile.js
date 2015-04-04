module.exports = function (grunt) {

  require('jit-grunt')(grunt, {
    nodewebkit: 'grunt-node-webkit-builder'
  });
  require('time-grunt')(grunt);

  var mac = process.platform === 'darwin';
  var path = require('path');

  grunt.initConfig({
    clean: {
      build: ['./build/'],
      dist: ['./dist/'],
      pre: ['./dist/client/vendor/', './dist/client/js/', './dist/client/styles/'],
      releases: [
        './build/RequelPro/osx/',
        './build/RequelPro/osx32/',
        './build/RequelPro/osx64/'
      ]
    },

    nodewebkit: {
      options: {
        version: '0.12.0',
        build_dir: './build',
        credits: './src/Credits.html',
        osx: false,
        win: false,
        linux32: false,
        linux64: false,
        macIcns: 'requelpro.icns'
      },
      dist: {
        options: {
          osx: true,
          win: true,
          linux32: true,
          linux64: true
        },
        src: ['./dist/**/*']
      },
      snapshot: {
        options: {
          osx: mac,
          win: !mac
        },
        src: ['./dist/**/*']
      },
      dev: {
        options: {
          platforms: ['osx64']
        },
        src: ['./dist/**/*']
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'src/fonts/',
            src: ['**'],
            dest: 'dist/fonts/'
          },
          {
            expand: true,
            flatten: true,
            cwd: 'src/img/',
            src: ['**'],
            dest: 'dist/img/'
          },
          {
            expand: true,
            flatten: true,
            cwd: './',
            src: [
              'src/*.html',
              'LICENSE',
              'package.json',
              '*.woff2',
              '*.tff',
              '*.svg',
              '*.woff',
              '*.eot'
            ],
            dest: 'dist/'
          }
        ]
      }
    },

    webpack: {
      client: {
        entry: './src/RequelPro/app.jsx',
        output: {
          filename: './dist/js/app.js',
          target: 'node-webkit'
        },
        externals: {
          'nw.gui': 'commonjs nw.gui',
          'rethinkdb': 'commonjs rethinkdb',
          'js-data-schema': 'commonjs js-data-schema',
          'path': 'commonjs path'
        },
        module: {
          loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            {
              test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'url-loader?limit=10000&minetype=application/font-woff'
            },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            // transpile ES6 to ES5
            {
              test: /(.+)\.js(x)?$/,
              exclude: /node_modules/,
              loader: 'babel-loader?blacklist=useStrict'
            },
            // load scss files using the sass, raw, and style loaders with the given import paths
            {
              test: /\.scss$/,
              loader: 'style!raw!sass?outputStyle=compressed&' +
              'includePaths[]=' +
              (path.resolve(__dirname, './node_modules/zurb-foundation/scss')) + '&' +
              'includePaths[]=' +
              (path.resolve(__dirname, './node_modules/sweetalert/lib'))
            }
          ],
          postLoaders: [
            // jshint our files before transpilation
            {
              test: /(.+)\.js$/, // include .js files
              exclude: /node_modules/, // exclude any and all files in the node_modules folder
              loader: "jshint-loader?failOnHint=true"
            }
          ]
        }
      }
    },

    concat: {
      css: {
        src: [
          'src/client/vendor/bower_components/normalize-css/normalize.css',
          'src/client/vendor/bower_components/AngularJS-Toaster/toaster.css',
          'src/client/vendor/bower_components/sweetalert/lib/sweet-alert.css',
          'src/client/vendor/bower_components/bootstrap-additions/dist/bootstrap-additions.css',
          'dist/client/styles/main.css'
        ],
        dest: 'dist/client/styles/main.css'
      }
    },

    uglify: {
      dist: {
        files: [
          {
            expand: true,
            cwd: './dist',
            src: ['**/*.js', '!node_modules/**/*'],
            dest: './dist'
          }
        ]
      }
    },

    shell: {
      open_mac: {
        command: 'open ./build/RequelPro/osx64/RequelPro.app'
      },
      open_win: {
        command: '"build/releases/RequelPro/win/RequelPro/RequelPro.exe" &'
      },
      close_mac: {
        command: 'ps -ef | grep build/RequelPro/osx64/RequelPro.app/Contents/MacOS/node-webkit | grep -v grep | awk \'{print $2}\' | xargs kill -9'
      }
    }
  });

  grunt.registerTask('prebuild', [
    'clean:dist',
    'webpack',
    'copy',
    'clean:pre'
  ]);

  var buildTasks = [
    'prebuild',
    'clean:releases',
    'nodewebkit:dev'
  ];

  if (process.platform === 'darwin') {
    buildTasks.unshift('shell:close_mac');
    buildTasks.push('shell:open_mac');
  } else {
    buildTasks.push('shell:open_win');
  }

  grunt.registerTask('build', buildTasks);

  grunt.registerTask('snapshot', [
    'prebuild',
    'clean:releases',
    'nodewebkit:snapshot'
  ]);

  grunt.registerTask('dist', [
    'prebuild',
    'clean:releases',
    //'uglify',
    'nodewebkit:dist'
  ]);

  grunt.registerTask('o', ['shell:open_mac']);
  grunt.registerTask('c', ['shell:close_mac']);

  grunt.registerTask('default', [
    'build'
  ]);
};
