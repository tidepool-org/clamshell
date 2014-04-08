// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
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
            'build/clamshell.min.js': ['app_build/clamshell.js']
          }
        }
      },
      shell: {
        buildApp: {
          // load config and start app at same time
          command: [
            './node_modules/.bin/webpack --debug src/main.js app_build/clamshell.js'
          ]
        },
        testBuild: {
          command: [
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
              demo : process.env.DEMO,
              api_host : process.env.API_HOST
            }
          },
          files: {
            'app_build/appConfig.js': ['appConfig.js']
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
  grunt.registerTask('build', ['shell:buildApp','uglify']);
  grunt.registerTask('parseConfig', ['template:parseConfig']);
  grunt.registerTask('test', ['shell:testBuild','shell:testRun']);

};
