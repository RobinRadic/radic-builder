/*global module:false*/
module.exports = function (grunt) {

    //require('./tasks/radicbuilder')(grunt);

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var pkg = grunt.file.readJSON('package.json');
    var jv = pkg.dependencies.jquery;
    var config = grunt.file.readYAML('_config.yml');


    function getCustomBuild() {
        var custombuild = 'build:*';

        function toBuildStr(str) {
            return ':+' + str.replace(/,\s/g, ':+')
        }

        var jq = toBuildStr(config.build.modules.jquery);
        var radic = toBuildStr(config.build.modules.radic);
        var command = custombuild + jq + radic;
        grunt.log.writeln(command);
        return 'grunt ' + command;
    }

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

                dest: "dist/<%= config.build.filename %>.js",
                minimum: [
                    "core",
                    "selector"
                ],
                // Exclude specified modules if the module matching the key is removed
                removeWith: {
                    ajax: ["manipulation/_evalUrl", "event/ajax"],
                    callbacks: ["deferred"],
                    css: ["effects", "dimensions", "offset"],
                    sizzle: ["css/hiddenVisibleSelectors", "effects/animatedSelector"]
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
            widgets2dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'widgets',
                        src: ['**'],
                        dest: 'dist/widgets'
                    }
                ]

            },
            jquery2src: {
                src: 'node_modules/jquery/src/jquery.js',
                dest: 'src/jquery.js'
            },
            dist2testing: {
                files: [{
                    src: 'dist/**/*',
                    dest: 'testing/'
                }, {
                    expand: true,
                    cwd: 'node_modules/nodeunit/examples/browser',
                    src: '*.js',
                    dest: 'testing/example'
                }]
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
        preprocess: {
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
            dist: ['dist'],
            testing: ['testing/dist', 'testing/example']
        },
        uglify: {
            options: {
                report: 'gzip'
            },
            dist: {
                files: {
                    'dist/<%= config.build.filename %>.min.js': ['dist/<%= config.build.filename %>.js']
                }
            }
        },
        shell: {
            lodash_collections: {
                command: 'lodash underscore include=omit,pick,values,keys,where,cloneDeep exports=none -o lodash/lo_collections.js'
            },
            lodash_template: {
                command: 'lodash underscore include=template exports=none -o lodash/lo_template.js'
            },
            test: {
                command: 'nodeunit testing/*.js'
            },
            build: {
                command: getCustomBuild
            }
        },
        watch: {
            js: {
                files: '{src,widgets}/**/*',
                tasks: ['radicbuild'],
                options: {
                    liverreload: true
                }
            },
            html: {
                files: '{src,widgets,test}/**/*',
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

    grunt.loadTasks("grunt-jquery/" + jv);




    // Default task.
    // grunt.registerTask('updated-jquery', ['copy:jquery2src']);


    var modulesToBuild = "custom:*:+core:+github"; //:-github"; //'build:*:+core:+github';


    grunt.registerTask('dist', function () {
        grunt.task.run([
            'clean:tmp',
            'clean:dist',
            'copy:src2build',
            'shell:build',
            'clean:tmp',
            'uglify:dist'
        ]);
    })


    grunt.registerTask('radicbuild', [
        'clean:tmp',
        'clean:dist',
        'copy:src2build',
        modulesToBuild,
        'copy:widgets2dist',
        'preprocess:html',
        'clean:tmp',
        'copy:test2dist',
        //   'uglify:dist'
    ]);


    grunt.registerTask('test', [
        'clean:testing',
        'copy:dist2testing',
        'shell:test'
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
