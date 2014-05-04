// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is app_buildributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

module.exports = function(grunt) {
  'use strict';

  var packageJson = require('./package.json');

  // Project configuration.
  grunt.initConfig({
      pkg: packageJson,
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
      },
      uglify: {
        options: {
          mangle: false
        },
        my_target: {
          files: {
            'app_build/clamshell.min.js': ['app_build/clamshell.js']
          }
        }
      },
      shell: {
        buildApp: {
          command: [
            './node_modules/.bin/webpack --debug src/main.js app_build/clamshell.js'
          ]
        },
        runApp: {
          command: [
            'exec node clamshellServer',
            'echo running on port $HOST'
          ].join('&&')
        },
        testBuild: {
          command: [
            'rm -r build',
            './node_modules/.bin/jsx src/ build/',
            './node_modules/.bin/browserify test/**/*.js -o build/browserified.js'
          ].join('&&'),
          options: {
            async: false,
            expand: true
          }
        },
        testRun: {
          command: [
            './node_modules/.bin/testem ci'
          ]
        }
      },
      template: {
        parseConfig: {
          options: {
            data: {
              version : packageJson.version,
              demo : process.env.DEMO ,
              api_host : process.env.API_HOST || 'https://devel-api.tidepool.io'
            }
          },
          files: {
            'app_build/appConfig.js': ['appConfig.js']
          }
        },
        parseDemoConfig: {
          options: {
            data: {
              version : packageJson.version,
              demo : true ,
              api_host : 'https://devel-api.tidepool.io'
            }
          },
          files: {
            'app_build/appConfig.js': ['appConfig.js']
          }
        },
        parseAppLocalConfig: {
          options: {
            data: {
              version : packageJson.version,
              demo : false ,
              api_host : 'https://devel-api.tidepool.io'
            }
          },
          files: {
            'app_build/appConfig.js': ['appConfig.js']
          }
        },
        parseAllLocalConfig: {
          options: {
            data: {
              version : packageJson.version,
              demo : false ,
              api_host : 'http://localhost:8009'
            }
          },
          files: {
            'app_build/appConfig.js': ['appConfig.js']
          }
        },
        parseProd: {
          options: {
            data: {
              version : packageJson.version,
              production : true
            }
          },
          files: {
            'app_build/index.html': ['index.html']
          }
        },
        parseDev: {
          options: {
            data: {
              version : packageJson.version,
              production : false
            }
          },
          files: {
            'app_build/index.html': ['index.html']
          }
        }
      }
    });

  // Process Config

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-template');

  // Default task(s).
  grunt.registerTask('default', ['test']);
  // Standard tasks
  grunt.registerTask('build-dev', ['shell:buildApp','template:parseDev']);
  grunt.registerTask('build-prod', ['shell:buildApp','uglify','template:parseProd']);
  grunt.registerTask('parse-config', ['template:parseConfig']);
  // Development
  grunt.registerTask('run-app-local', ['build-dev','template:parseAppLocalConfig','shell:runApp']);
  grunt.registerTask('run-all-local', ['build-dev','template:parseAllLocalConfig','shell:runApp']);
  grunt.registerTask('run-demo', ['build-dev','template:parseDemoConfig','shell:runApp']);
  grunt.registerTask('run', ['build-dev','parse-config','shell:runApp']);
  grunt.registerTask('test', ['jshint','shell:testBuild','shell:testRun']);

};
