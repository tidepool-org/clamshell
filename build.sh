#! /bin/bash -eu

rm -rf node_modules
npm install .

# Build static site
./node_modules/.bin/grunt build-prod
