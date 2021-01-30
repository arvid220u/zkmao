#!/usr/bin/env bash

function checkout_web {
    git checkout web
}

GIT_HASH=$(git rev-parse --short HEAD)
BRANCH=$(git branch --show-current)

cp node_modules/snarkjs/build/snarkjs.min.js public/snarkjs.min.js
npm run build
if ! checkout_web; then
    echo "error!"
    exit -1
fi
cd build && cp -r * ../../ && cd ../..
echo $GIT_HASH > version.txt
git add .
git c -m "publish site :) $GIT_HASH"
git push
git checkout $BRANCH
echo "version: $GIT_HASH"
