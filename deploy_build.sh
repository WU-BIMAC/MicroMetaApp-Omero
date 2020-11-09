#!/bin/bash

#copy over html,css,js and templates
echo "Deploying built resources to web app directory..."
mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/css
cp public/fontStyle.css omero_microscopyMetadataTool/static/microscopyMetadataTool/css/
cp node_modules/4dn-microscopy-metadata-tool/public/assets/css/style-new.css omero_microscopyMetadataTool/static/microscopyMetadataTool/css/

mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/js
cp dist/MicroscopyMetadataToolOmero.dev.js omero_microscopyMetadataTool/static/microscopyMetadataTool/js/

mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/images
mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/images/png
mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/images/svg
cp public/assets/svg/* omero_microscopyMetadataTool/static/microscopyMetadataTool/images/svg
cp public/assets/png/* omero_microscopyMetadataTool/static/microscopyMetadataTool/images/png

