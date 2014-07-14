module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      build: ['./build/'],
      dist: ['./dist/'],
      pre: ['./dist/client/vendor/', './dist/client/js/', './dist/client/styles/'],
      releases: ['./build/releases/**/*']
    },

    jshint: {
      client: {
        options: {
          jshintrc: './src/client/.jshintrc'
        },
        src: [
          './src/client/js/**/*.js'
        ]
      },
      server: {
        options: {
          jshintrc: './src/server/.jshintrc',
          ignores: [
            './src/server/node_modules/**/*'
          ]
        },
        src: [
          './src/server/**/*.js'
        ]
      }
    },

    nodewebkit: {
      dist: {
        options: {
          build_dir: './build',
          mac: true,
          win: true,
          linux32: true,
          linux64: true
        },
        src: ['./dist/**/*']
      },
      snapshot: {
        options: {
          build_dir: './build',
          mac: true,
          win: false,
          linux32: false,
          linux64: false
        },
        src: ['./dist/**/*']
      },
      dev: {
        options: {
          build_dir: './build',
          mac: true,
          win: false,
          linux32: false,
          linux64: false,
          timestamped_builds: true
        },
        src: ['./dist/**/*']
      }
    },

    copy: {
      dist: {
        expand: true,
        flatten: false,
        cwd: 'src/',
        src: ['**/*', '!**/vendor/', '!**/js/'],
        dest: 'dist/'
      }
    },

    concat: {
      css: {
        src: [
          'src/client/vendor/bower_components/normalize-css/normalize.css',
          'src/client/styles/requelpro.css'
        ],
        dest: 'dist/client/styles/main.css'
      },
      app: {
        src: [
          'src/client/js/app.js',
          'src/client/js/mainMenu.js'
        ],
        dest: 'dist/client/js/app.js'
      },
      plugins: {
        src: [
          'src/client/vendor/bower_components/jquery/dist/jquery.js',
          'src/client/vendor/bower_components/angular/angular.js',
          'src/client/vendor/bower_components/angular-ui-router/release/angular-ui-router.js',
          'src/client/vendor/bower_components/mousetrap/mousetrap.js',
          'src/client/vendor/bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.js'
        ],
        dest: 'dist/client/js/plugins.js'
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
    }
  });

  grunt.registerTask('prebuild', [
    'jshint',
    'clean:dist',
    'copy',
    'clean:pre',
    'concat'
  ]);

  grunt.registerTask('build', [
    'prebuild',
    'clean:releases',
    'nodewebkit:dev'
  ]);

  grunt.registerTask('snapshot', [
    'prebuild',
    'clean:releases',
    'nodewebkit:snapshot'
  ]);

  grunt.registerTask('dist', [
    'prebuild',
    'clean:releases',
    'uglify',
    'nodewebkit:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
