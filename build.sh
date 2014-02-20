#! /bin/bash -eu

rm -rf node_modules
rm -rf build
npm install .

# run tests
./node_modules/.bin/jsx src/ build/
./node_modules/.bin/browserify test/**/*.js -o build/browserified.js
./node_modules/.bin/testem