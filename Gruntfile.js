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
        'public/js/**/*.js',
        'public/test/**/*.js'
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
        src: ['./public/**/*']
      },
      snapshot: {
        options: {
          build_dir: './build',
          mac: true,
          win: false,
          linux32: false,
          linux64: false
        },
        src: ['./public/**/*']
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
        src: ['./public/**/*']
      }
    }
  });

  grunt.registerTask('link', function () {
    var exec = require('child_process').exec;
    var child;
    var done = this.async();

    child = exec('npm link', { cwd: 'src/' },
      function (err, stdout, stderr) {
        if (err) {
          grunt.log.error(stderr);
          done(err);
        } else {
          grunt.log.writeln(stdout);
          child = exec('npm link RequelPro', { cwd: './' },
            function (err, stdout, stderr) {
              if (err !== null) {
                grunt.log.error(stderr);
                done(err);
              } else {
                grunt.log.writeln(stdout);
                done();
              }
          });
        }
    });
  });

  grunt.registerTask('prebuild', [
    'jshint',
    'link'
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
