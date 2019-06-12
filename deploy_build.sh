#!/bin/bash

#copy over html,css,js and templates
echo "Deploying built resources to web app directory..."
mkdir -p omero_microscopyMetadataTool/static/microscopyMetadataTool/js
cp dist/MicroscopyMetadataToolOmero.dev.js omero_microscopyMetadataTool/static/microscopyMetadataTool/js/
