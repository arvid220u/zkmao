#!/usr/bin/env bash

function checkout_web {
    git checkout web
}

npm run build
if ! checkout_web; then
    echo "error!"
    exit -1
fi
cd build && cp -r * ../../ && cd ../..
git add .
git c -m 'publish site :)'
git push
git checkout main
