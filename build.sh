#! /bin/bash -eu

BUILD_DIR=build

function cleanup {
  echo "Deleting the build directory: ${BUILD_DIR}"
  rm -r ${BUILD_DIR};
}

rm -rf node_modules
npm install .
npm install -g react-tools

# run tests
./node_modules/.bin/grunt test