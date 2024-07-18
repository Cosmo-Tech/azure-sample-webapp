#!/bin/bash
set -e

WORKING_DIR="/tmp/webapp"
BUILD_DIR="$WORKING_DIR/build"

echo "Copying webapp build folder to $BUILD_DIR..."
cp -r build $BUILD_DIR/


echo "Starting script patch_and_start_server.sh..."
pushd patch_webapp_server
  python3 main.py --csp azure,custom,default -i ../patch_config/ -o $BUILD_DIR
popd


echo "Starting webapp server..."
serve -s $BUILD_DIR
