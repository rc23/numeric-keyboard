module.exports = function (grunt) {
    'use strict';

    // Times how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    require('jit-grunt')(grunt, {ngtemplates: 'grunt-angular-templates'});

    require('load-grunt-tasks')(grunt);

    var jsLintConfig = grunt.file.readJSON('.jslintrc');

    // Define the configuration for all the tasks.
    grunt.initConfig({
        config: {
            moduleName: 'numeric-keyboard',
            path: {
                root: '.',
                vendor: {
                    root: 'vendor'
                },
                dist: {
                    root: 'dist'
                },
                src: {
                    root: 'src',
                    assets: {
                        root: '<%= config.path.src.root %>/**/assets',
                        styles: '<%= config.path.src.assets.root %>/**/styles'
                    },
                    scripts: '<%= config.path.src.root %>/**/scripts',
                    views: '<%= config.path.src.root %>/**/views'
                },
                tests: {
                    root: '<%= config.path.src.root %>/**/tests'
                },
                reports: {
                    root: '<%= config.path.target.root %>/reports',
                    complexity: '<%= config.path.reports.root %>/complexity',
                    lint: '<%= config.path.reports.root %>/lint'
                },
                config: {
                    root: 'config'
                },
                sandbox: {
                    root: 'sandbox'
                },
                target: {
                    root: 'target',
                    coverage: '<%= config.path.target.root %>/coverage',
                    scripts: '<%= config.path.target.root %>/scripts',
                    styles: '<%= config.path.target.root %>/styles',
                    images: '<%= config.path.target.root %>/images',
                    sprites: '<%= config.path.target.root %>/sprites'
                },
                temp: {
                    root: 'temp',
                    scripts: '<%= config.path.temp.root %>/scripts',
                    styles: '<%= config.path.temp.root %>/styles',
                    images: '<%= config.path.temp.root %>/images',
                    sprites: '<%= config.path.temp.root %>/sprites'
                }
            }
        },
        // Empties folders to start from a clean slate.
        clean: {
            dist: [
                '<%= config.path.dist.root %>/**/*',
                '<%= config.path.dist.root %>'
            ],
            reports: [
                '<%= config.path.reports.root %>/**/*',
                '<%= config.path.reports.root %>'
            ],
            target: [
                '<%= config.path.target.root %>/**/*',
                '<%= config.path.target.root %>'
            ],
            temp: [
                '<%= config.path.temp.root %>/**/*',
                '<%= config.path.temp.root %>'
            ]
        },
        // Concat source files.
        concat: {
            scripts: {
                src: [
                    '<%= config.path.src.scripts %>/*-module.js',
                    '<%= config.path.src.scripts %>/**/*.js',
                    '<%= config.path.target.root%>/templates.js'
                ],
                dest: '<%= config.path.temp.scripts %>/numeric-keyboard-module.js'
            },
            styles: {
                src: [
                    '<%= config.path.src.assets.styles %>/**/_*.scss',
                    '<%= config.path.src.assets.styles %>/**/*.scss',
                    '<%= config.path.temp.sprites %>/**/*.scss'
                ],
                dest: '<%= config.path.temp.styles %>/numeric-keyboard.scss'
            }
        },
        buildTasks: {
            source: [
                'ngtemplates:build',
                'concat'
            ],
            dist: [
                'clean',
                'build:source',
                'check',
                'copy:temp',
                'concat:scripts',
                'build-svgs',
                'concat:styles',
                'sass:dist',
                'autoprefixer',
                'copy:dist'
                //'clean:temp', 'clean:target', 'clean:reports'
            ]
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    noCache: true
                },
                files: {
                    '<%= config.path.dist.root %>/css/numeric-keyboard.css':
                        '<%= config.path.temp.styles %>/numeric-keyboard.scss'

                }
            }
        },
        jslint: {
            source: {
                src: [
                    'Gruntfile.js',
                    'grunt/**/*.js',
                    '<%= config.path.src.scripts %>/**/*.js',
                    '<%= config.path.tests.root %>/**/*.js'
                ],
                directives: jsLintConfig,
                options: {
                    edition: 'latest',
                    shebang: true,
                    errorsOnly: false,
                    failOnError: true,
                    junit: '<%= config.path.reports.lint %>/junit_src.xml',
                    log: '<%= config.path.reports.lint %>/lint_src.log',
                    jslintXml: '<%= config.path.reports.lint %>/jslint_src.xml',
                    checkstyle: '<%= config.path.reports.lint %>/checkstyle_src.xml'
                }
            }
        },
        ngtemplates: {
            options: {
                module: 'numeric-keyboard',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true
                },
                url: function changeURL(url) {
                    return grunt.template.process('KEYBOARD#' + url);
                }
            },
            build: {
                cwd: '<%= config.path.src.root %>',
                src: ['**/views/**/*.html'],
                dest: '<%= config.path.target.root %>/templates.js'
            }
        },
        karma: {
            options: {
                frameworks: ['jasmine'],
                browsers: ['PhantomJS2'],
                hostname: 'localhost',
                files: [
                    '<%= config.path.vendor.root %>/angular/angular.js',
                    '<%= config.path.vendor.root %>/angular-mocks/angular-mocks.js',
                    '<%= config.path.vendor.root %>/angular-touch/angular-touch.js',

                    // other vendor dependencies here
                    '<%= config.path.src.scripts %>/*-module.js',
                    '<%= config.path.src.scripts %>/unitTestsUtils.js',
                    '<%= config.path.src.scripts %>/**/*.js',

                    // templates
                    '<%= config.path.target.root %>/templates.js',

                    // tests
                    '<%= config.path.src.root %>/**/*-mock.js',
                    '<%= config.path.src.root%>/**/*-spec.js'

                ],
                exclude: [
                    '<%= config.path.vendor %>/**/*.min.js'
                ],
                preprocessors: {
                    '<%= config.path.src.scripts %>/**/*.js': 'coverage'
                }
            },
            test: {
                reporters: ['progress', 'coverage'],
                coverageReporter: {
                    reporters: [
                        {type: 'html', dir: '<%= config.path.target.coverage %>'}, // human-readable HTML
                        {type: 'text-summary', dir: '<%= config.path.target.coverage %>'}
                    ]
                },
                singleRun: false
            },
            ci: {
                reporters: ['progress', 'coverage'],
                coverageReporter: {
                    type: 'cobertura', // cobertura XML file format
                    dir: '<%= config.path.target.coverage %>'
                },
                singleRun: true
            }
        },
        connect: {
            sandbox: {
                options: {
                    base: [
                        {
                            path: '<%= config.path.root %>'
                        }
                    ],
                    hostname: '0.0.0.0',
                    port: 5555,
                    livereload: 35730
                }
            }
        },
        watch: {
            options: {
                livereload: '<%= connect.sandbox.options.livereload %>',
                livereloadOnError: false,
                spawn: false
            },
            dist: {
                files: ['<%= config.path.src.root %>/**/*.{js,scss,html}'],
                tasks: [
                    'clean',
                    'ngtemplates',
                    'copy:temp',
                    'build-svgs',
                    'concat',
                    'sass:dist',
                    'copy:dist',
                    'autoprefixer',
                    'clean:temp',
                    'clean:target',
                    'clean:reports'
                ]
            }
        },
        svg_sprite: {
            options: {
                // Task-specific options go here.
                mode: {
                    css: {
                        bust: false,
                        dest: '',
                        sprite: 'keyboard',
                        prefix: '.%s',
                        render: {
                            scss: {
                                dest: 'keyboard.scss',
                                template: '<%=config.path.config.root%>/sprite-template.mustache'
                            }
                        }
                    }
                },
                variables: {
                    svgPath: '../images/keyboard.svg',
                    pngPath: '../images/keyboard.png',
                    pngPath2x: '../images/keyboard@2x.png',
                    pngPath3x: '../images/keyboard@3x.png'
                },
                shape: {
                    spacing: {
                        padding: 5
                    }
                }
            },
            app: {
                cwd: '<%=config.path.temp.images%>',
                src: '**/*.svg',
                dest: '<%=config.path.temp.sprites%>'
            }
        },
        copy: {
            temp: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        cwd: '<%=config.path.src.root%>',
                        src: '**/*.svg',
                        dest: '<%=config.path.temp.images%>'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.path.temp.scripts %>',
                        src: '*.js',
                        dest: '<%= config.path.dist.root %>'
                    },
                    // {
                    //     expand: true,
                    //     cwd: '<%= config.path.temp.styles %>',
                    //     src: '*.css',
                    //     dest: '<%= config.path.dist.root %>'
                    // },
                    {
                        expand: true,
                        cwd: '<%=config.path.temp.sprites%>',
                        src: '*.{svg,png}',
                        dest: '<%=config.path.dist.root%>/images'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%=config.path.src.root%>',
                        src: '**/translations/*.json',
                        dest: '<%=config.path.dist.root%>/translations/'
                    }
                ]
            }
        },
        // Add vendor prefixes to CSS
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 3 versions', 'Android >= 2']
            },
            dist: {
                src: '<%= config.path.dist.root %>/css/numeric-keyboard.css'
            }
        }
    });

    grunt.registerTask('check', [
        'ngtemplates',
        'newer:jslint',
        'karma:ci'
    ]);

    grunt.registerTask('test', [
        'ngtemplates',
        'karma:test'
    ]);

    grunt.registerTask('sandbox', [
        'build',
        'connect:sandbox',
        'watch'
    ]);

    grunt.registerTask('build-svgs', [
        'svg_sprite'
    ]);

    grunt.registerMultiTask('buildTasks', function () {
        grunt.task.run(this.data);
    });

    grunt.registerTask('build', function (target) {
        if (!target) {
            target = 'dist';
        }
        grunt.task.run(['buildTasks:' + target]);
    });
};
