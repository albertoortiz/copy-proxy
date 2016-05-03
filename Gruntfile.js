'use strict';

module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        axonix: {
            version: '1.0.0',
            projectname: 'copy-proxy'
            // dockerversion: '<%= axonix.version %>_<%= gitinfo.local.branch.current.name.replace("/", "_") %>_<%= gitinfo.local.branch.current.shortSHA %>'
        },

        paths: {
            src: {
                copyP: './copy-proxy'
                //docker: 'docker-resources'
            },
            build: 'build',
            dist: 'dist'
        },

        clean: {
            all: ['<%= paths.dist %>', '<%= paths.build %>']
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.src.copyP %>',
                        dest: '<%= paths.build %>',
                        src: ['**/*.js']
                    },
                    {
                        expand: true,
                        cwd: './', // from root
                        dest: '<%= paths.build %>',
                        src: ['package.json']
                    }
                ]
            }
        },

        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: '<%= paths.dist %>/copyP.tar.gz'
                },
                files: [
                    { expand: true,
                        cwd: '<%= paths.build %>',
                        src: [
                            '**', // all
                            '!node_modules/**', // ! avoid
                            '!test/**',
                            '!build/**',
                            '!Gruntfile.js',
                            '!README.md'
                        ],
                        dest: ''
                    } // makes all src relative to cwd
                ]
            }
        },

        mochaTest: {
            all: {
                src: ['<%= paths.src.copyP %>/test/**/*.js'],
                options: {
                    reporter: 'spec',
                    timeout: 1000,
                    spawn: false
                }
            }
        }
    });

    // Register tasks
    grunt.registerTask('dist', 'Compile and add RELEASE file, copies to build dir',
        ['clean', 'copy', 'compress', 'mochaTest']);

    grunt.registerTask('test', 'Execute unit test',
        ['mochaTest']);
};