module.exports = function (grunt) {

  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);

  grunt.initConfig({
    clean: {
      build: ["./build/"],
      dist: ["./dist/"],
      releases: ["./build/releases/**/*"]
    },

    jshint: {
      client: {
        options: {
          jshintrc: "./src/client/.jshintrc"
        },
        src: [
          "./src/client/js/**/*.js"
        ]
      },
      server: {
        options: {
          jshintrc: "./src/server/.jshintrc",
          ignores: [
            "./src/server/node_modules/**/*"
          ]
        },
        src: [
          "./src/server/**/*.js"
        ]
      }
    },

    nodewebkit: {
      dist: {
        options: {
          build_dir: "./build",
          mac: true,
          win: true,
          linux32: true,
          linux64: true
        },
        src: ["./dist/**/*"]
      },
      snapshot: {
        options: {
          build_dir: "./build",
          mac: true,
          win: false,
          linux32: false,
          linux64: false
        },
        src: ["./src/**/*"]
      },
      dev: {
        options: {
          zip: true,
          build_dir: "./build",
          mac: true,
          win: false,
          linux32: false,
          linux64: false,
          timestamped_builds: true
        },
        src: ["./src/**/*"]
      }
    },

    copy: {
      dist: {
        expand: true,
        flatten: false,
        cwd: 'src/',
        src: ['**/*'],
        dest: 'dist/'
      }
    },

    uglify: {
      dist: {
        files: [
          {
            expand: true,
            cwd: './dist/server',
            src: ['**/*.js', '!node_modules/**/*'],
            dest: './dist/server'
          }
        ]
      }
    }
  });

  grunt.registerTask("prebuild", [
    "jshint"
  ]);

  grunt.registerTask("build", [
    "prebuild",
    "clean:releases",
    "nodewebkit:dev"
  ]);

  grunt.registerTask("snapshot", [
    "prebuild",
    "clean:releases",
    "nodewebkit:snapshot"
  ]);

  grunt.registerTask("dist", [
    "prebuild",
    "clean:dist",
    "clean:releases",
    "copy",
    "uglify",
    "nodewebkit:dist"
  ]);

  grunt.registerTask("default", [
    "build"
  ]);
};
