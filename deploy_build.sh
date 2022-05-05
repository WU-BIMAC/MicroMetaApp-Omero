#!/bin/bash

#copy over html,css,js and templates
echo "Deploying built resources to web app directory..."
mkdir -p omero_microMetaApp/static/microMetaAppOmero/css
cp public/fontStyle.css omero_microMetaApp/static/microMetaAppOmero/css/
cp node_modules/micro-meta-app-react/public/assets/css/style-new.css omero_microMetaApp/static/microMetaAppOmero/css/

mkdir -p omero_microMetaApp/templates/microMetaAppOmero
cp public/index.html omero_microMetaApp/templates/microMetaAppOmero/

mkdir -p omero_microMetaApp/static/microMetaAppOmero/js
cp build/MicroMetaAppOmero.dev.js omero_microMetaApp/static/microMetaAppOmero/js/

mkdir -p omero_microMetaApp/static/microMetaAppOmero/images
mkdir -p omero_microMetaApp/static/microMetaAppOmero/images/png
mkdir -p omero_microMetaApp/static/microMetaAppOmero/images/svg
cp public/assets/svg/* omero_microMetaApp/static/microMetaAppOmero/images/svg
cp public/assets/png/* omero_microMetaApp/static/microMetaAppOmero/images/png

mkdir -p ./dist
tar -cvf ./dist/omero_microMetaApp-1.7.13-b1.tar ./omero_microMetaApp