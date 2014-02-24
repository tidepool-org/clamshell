#! /bin/bash -eu

rm -rf node_modules
rm -rf build
rm -rf app_build
npm install .

# run tests
#./node_modules/.bin/grunt test

#build static site
./node_modules/.bin/grunt build