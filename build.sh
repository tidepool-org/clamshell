#! /bin/bash -eu

rm -rf node_modules
rm -rf build
rm -rf app_build
npm install .

#build static site
./node_modules/.bin/grunt build-prod