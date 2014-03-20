module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var dev = process.cwd().indexOf('/home/codetrain/reheat') === -1;

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
				'Gruntfile.js',
				'src/**/*.js',
				'test/**/*.js'
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

	grunt.registerTask('build', [
		'clean:releases',
		'nodewebkit:dev'
	]);

	grunt.registerTask('snapshot', [
		'clean:releases',
		'nodewebkit:snapshot'
	]);

	grunt.registerTask('dist', [
		'clean:releases',
		'nodewebkit:dist'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};
