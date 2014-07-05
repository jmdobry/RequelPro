module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      build: ['./build/'],
      releases: ['./build/releases/**/*']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'src/js/**/*.js',
        'src/test/**/*.js'
      ]
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
        src: ['./src/**/*']
      },
      snapshot: {
        options: {
          build_dir: './build',
          mac: true,
          win: false,
          linux32: false,
          linux64: false
        },
        src: ['./src/**/*']
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
        src: ['./src/**/*']
      }
    }
  });

  grunt.registerTask('prebuild', [
    'jshint'
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
    'nodewebkit:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
