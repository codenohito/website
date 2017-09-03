#!/bin/sh
echo "--- Begin deploy process of CodeNoHito website ---"
echo "Build production version..."
npm run build
echo "Sync the build on a production server..."
rsync -avzP dist/ dymio@codenohito.server:~/www/codenohito_website
echo "--- Deploy complete ---"
