/*global module:false*/
module.exports = function (grunt) {

    //require('./tasks/testbuilder')(grunt);

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var pkg = grunt.file.readJSON('package.json');
    var jv = pkg.dependencies.jquery;
    var config = grunt.file.readYAML('_config.yml');


    function getCustomBuild() {
        var custombuild = 'build:*';

        function toBuildStr(str) {
            if(str === null) return '';

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
            }
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
            jquery2src: {
                src: 'node_modules/jquery/src/jquery.js',
                dest: 'src/jquery.js'
            },
            dist2testing: {
                files: [{
                    src: 'dist/**',
                    dest: 'test/'
                }, {
                    expand: true,
                    cwd: 'node_modules/nodeunit/examples/browser',
                    src: '*.js',
                    dest: 'test/example'
                }]
            }
        },
        preprocess: {
            options: {
                context: {
                    DEBUG: true
                }
            },
            html: {
                src: 'test/pages/index.html',
                dest: 'dist/index.html'
            },
            js: {
                src: 'src/intro.js',
                dest: '.tmp/intro.js'
            }
        },
        clean: {
            tmp: ['.tmp'],
            dist: ['dist'],
            testing: ['test/dist', 'test/example']
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
                command: 'lodash underscore include=omit,pick,values,keys,where,cloneDeep,sortBy exports=none -o lodash/lo_collections.js'
            },
            lodash_template: {
                command: 'lodash underscore include=template exports=none -o lodash/lo_template.js'
            },
            test: {
                command: 'nodeunit test/*.js'
            },
            build: {
                command: getCustomBuild
            }
        },
        watch: {
            js: {
                files: '{src,src-ext}/**/*',
                tasks: ['testbuild'],
                options: {
                    liverreload: true
                }
            },
            html: {
                files: '{src,src-ext,test}/**/*',
                tasks: ['testbuild'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                tasks: ['testbuild'],
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


    var testBuildModules = "custom:*:+core:+github"; //:-github"; //'build:*:+core:+github';


    grunt.registerTask('dist', function () {
        grunt.task.run([
            'clean:tmp',
            'clean:dist',
            'copy:src2build',
            'preprocess:js',
            'shell:build',
            'clean:tmp',
            'uglify:dist'
        ]);
    });


    grunt.registerTask('testbuild', [
        'clean:tmp',
        'clean:dist',
        'copy:src2build',
        'preprocess:js',
        testBuildModules,
        'preprocess:html',
        'clean:tmp',
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
            'testbuild',
            // 'concurrent:server',

            'connect:livereload',
            'watch'
        ]);
    });

};
