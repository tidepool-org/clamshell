#! /bin/bash -eu

# cleanup modules then re-install
rm -rf node_modules
npm install .

# run tests
./node_modules/.bin/grunt test