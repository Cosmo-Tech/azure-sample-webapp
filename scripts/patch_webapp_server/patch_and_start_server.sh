#!/bin/bash
set -e

WORKING_DIR="/tmp/webapp"
BUILD_DIR="$WORKING_DIR/build"

echo "Copying webapp build folder to $BUILD_DIR..."
cp -r build $WORKING_DIR/


echo "Running script patch_webapp_server/main.py..."
pushd patch_webapp_server
  python3 main.py --csp azure,custom,default -i ../patch_config/ -o $BUILD_DIR
popd


echo "Starting webapp server..."
serve -s $BUILD_DIR
