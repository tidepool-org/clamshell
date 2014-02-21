#! /bin/bash -eu

rm -rf node_modules
rm -rf build
npm install .

# run tests
./node_modules/.bin/grunt test
