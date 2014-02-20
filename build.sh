#! /bin/bash -eu

rm -rf node_modules
rm -rf build
npm install .
sudo npm install -g react-tools

# run tests
./node_modules/.bin/grunt test