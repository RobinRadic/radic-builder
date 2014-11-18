/*global module:false*/
module.exports = function (grunt) {

    //require('./tasks/radicbuilder')(grunt);

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var pkg = grunt.file.readJSON('package.json');
    var jv = pkg.dependencies.jquery;
    var config = grunt.file.readYAML('_config.yml');


    // Project configuration.
    grunt.initConfig({
        config: config,
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0',
                base: {
                    options: {
                        index: 'index.html'
                    }
                }
            },
            livereload: {
                options: {

                    base: [
                        'dist'
                    ]
                }
            }/*
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= config.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }*/
        },

        build: {
            all: {
                src: '.tmp/',

                dest: "dist/jquery.js",
                minimum: [
                    "core",
                    "selector"
                ],
                // Exclude specified modules if the module matching the key is removed
                removeWith: {
                    ajax: [ "manipulation/_evalUrl", "event/ajax" ],
                    callbacks: [ "deferred" ],
                    css: [ "effects", "dimensions", "offset" ],
                    sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
                }
            }
        },
        copy: {
            src2build: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/jquery/src/',
                        src: ['**'],
                        dest: '.tmp/'
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**'],
                        dest: '.tmp/'
                    }
                ]
            },

            jquery2src: {
                src: 'node_modules/jquery/src/jquery.js',
                dest: 'src/jquery.js'
            },
            test2dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'test',
                        src: ['prism.css', 'prism.js'],
                        dest: 'dist/'
                    }
                ]
            }

        },
        preprocess : {
            options: {
                context: {
                    DEBUG: true
                }
            },
            html: {
                src: 'test/index.html',
                dest: 'dist/index.html'
            }
        },
        clean: {
            tmp: ['.tmp'],
            dist: ['dist']
        },
        uglify: {
            options: {
                report: 'gzip'
            },
            dist: {
                files: {
                    'dist/jquery.custom.min.js': ['dist/jquery.js']
                }
            }
        },
        watch: {
            js: {
                files: 'src/**',
                tasks: ['radicbuild'],
                options: {
                    liverreload: true
                }
            },
            html: {
                files: 'test/**',
                tasks: ['radicbuild'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                tasks: ['radicbuild'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'src/**',
                    'test/**',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        }
    });

    grunt.loadTasks( "grunt-jquery/" + jv );


    // Default task.
   // grunt.registerTask('updated-jquery', ['copy:jquery2src']);


    var modulesToBuild =  "custom"; //'build:*:+core:+github';

    grunt.registerTask('radicbuild', [
        'clean:tmp',
        'clean:dist',
        'copy:src2build',
        modulesToBuild,

        'preprocess:html',
        'clean:tmp',
        'copy:test2dist',
        'uglify:dist'
    ]);



    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'radicbuild',
           // 'concurrent:server',

            'connect:livereload',
            'watch'
        ]);
    });

};
