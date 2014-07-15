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
          linux64: false//,
//          timestamped_builds: true
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
      },
      'fonts': {
        expand: true,
        flatten: true,
        cwd: 'src/client/fonts/',
        src: ['**'],
        dest: 'dist/client/fonts/'
      },
      'font-awesome': {
        expand: true,
        flatten: true,
        cwd: 'src/client/vendor/bower_components/font-awesome/fonts/',
        src: ['**'],
        dest: 'dist/client/fonts/'
      }
    },

    sass: {
      dist: {
        files: {
          'dist/client/styles/main.css': 'src/client/styles/requelpro.scss'
        },
        options: {
          includePaths: [
            'src/client/vendor/bower_components/bootstrap-sass/vendor/assets/stylesheets/',
            'src/client/vendor/bower_components/font-awesome/scss/'
          ]
        }
      }
    },

    concat: {
      css: {
        src: [
          'src/client/vendor/bower_components/normalize-css/normalize.css',
          'dist/client/styles/main.css'
        ],
        dest: 'dist/client/styles/main.css'
      },
      app: {
        src: [
          '.tmp/js/templates.js',
          'src/client/js/app.js',
          'src/client/js/mainMenu.js',
          'src/client/js/core/**/*.js',
          'src/client/js/connect/**/*.js',
          'src/client/js/content/**/*.js'
        ],
        dest: 'dist/client/js/app.js'
      },
      plugins: {
        options: {
          separator: ';'
        },
        src: [
          'src/client/vendor/bower_components/jquery/dist/jquery.js',
          'src/client/vendor/bower_components/angular/angular.js',
          'src/client/vendor/bower_components/angular-ui-router/release/angular-ui-router.js',
          'src/client/vendor/bower_components/angular-data/dist/angular-data.js',
          'src/client/vendor/bower_components/angular-cache/dist/angular-cache.js',
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
    },

    html2js: {
      app: {
        options: {
          base: 'src/client/js/'
        },
        src: ['src/client/js/**/*.html'],
        dest: '.tmp/js/templates.js'
      }
    },

    shell: {
      open: {
        command: 'open ./build/releases/RequelPro/mac/RequelPro.app'
      },
      close: {
        command: 'ps -ef | grep build/releases/RequelPro/mac/RequelPro.app/Contents/MacOS/node-webkit | grep -v grep | awk \'{print $2}\' | xargs kill -9'
      }
    }
  });

  grunt.registerTask('prebuild', [
    'jshint',
    'clean:dist',
    'copy',
    'clean:pre',
    'html2js',
    'sass',
    'concat'
  ]);

  grunt.registerTask('build', [
    'shell:close',
    'prebuild',
    'clean:releases',
    'nodewebkit:dev',
    'shell:open'
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

  grunt.registerTask('o', ['shell:open']);
  grunt.registerTask('c', ['shell:close']);

  grunt.registerTask('default', [
    'build'
  ]);
};
