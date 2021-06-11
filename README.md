# 4DN Micro-Meta App OMERO plugin -- alpha prototype

* [Summary](#summary)
* [Background](#background)
* [Description](#description)
* [Installation](#installation)

## Summary
Micro-Meta App is an interactive tool that was developed by Alex Rigano in the Strambio De Castillia's lab at UMMS to facilitate the documentation of fluorescence microscopy experiments. 
It is designed around an interactive graphical interface that intuitively guides bench scientists through the often laborious process of collecting and reporting the minimal microscopy and image acquisition metadata defined by the 4DN microscopy metadata tiered system of guidelines. 

This repository contains a prototype of a plugin to be integrated into the [OMERO](https://www.openmicroscopy.org/omero/scientists/).web browser.

Other available implementations of Micro-Meta App include:

- A [web-app version](https://github.com/WU-BIMAC/4DNMicroscopyMetadataToolReact) implemented in [React](https://reactjs.org/)
- A [stand-alone version](https://github.com/WU-BIMAC/4DNMicroscopyMetadataToolReactElectron) implemented in [Electron](https://www.electronjs.org/)

![Micro-Meta App: Create Microscope GUI](http://big.umassmed.edu/omegaweb/wp-content/uploads/2020/05/06_Build-a-Microscope_2.png)
Micro-Meta App is designed to aid in the collection of both Microscope Hardware Specifications and Image Acquisition Settings metadata. In this example, a previously saved Microscope file was selected from an available repository and opened for further editing. In order to add the metadata associated with a newly purchased objective to a Microscope file the “Magnification” drop-down menu is opened [1] and an additional “Objective” [2] is dragged onto the workspace.

## Background
Adequate recordkeeping is essential for most experiments as it is necessary in order to evaluate results, share data and allow experiments to be repeated. Keeping notes on microscopy experiments should be relatively unchallenging, as the microscope is a machine equipped with a limited number of known parts and settings. Nevertheless, to this date no widely adopted set of metadata guidelines to be recorded or published with imaging data exists. Metadata automatically recorded by microscopes from different companies vary widely and pose a substantial challenge for microscope users to create a good faith record of their work. Similarly, the complexity and aim of experiments using microscopes varies leading to different reporting requirements from the simple description of a sample to the need to document the complexities of sub-diffraction resolution imaging in living cells and beyond.
To address this challenge, the 4DN consortium has put forth a 4DN extension of the OME Core metadata model, which includes a tiered system of reporting guidelines that scales quality control and reporting requirements with experimental complexity and a comprehensive list of metadata key-value pairs that should be recorded for each tier, and a detailed explanation of why these values matter. Micro-Meta App was developed in order to lessen the recordkeeping burden, support the collection of microscopy provenance medatata and facilitate the wide adoption of these standards by  the the imaging community at large.

## Description
Micro-Meta App is a novel application that provides an interactive and intuitive approach for rigorous record-keeping in fluorescence microscopy and is based on the 4DN-OME Microscopy metadata standard and on the proposed tiered-system of guidelines.  The user’s data processing workflow consists of multiple steps. First, in the Create Microscope modality (Figure 1), the App allows the users to build a graphical representation of the microscope hardware by dragging-and-dropping individual components onto the workspace and entering the relevant attribute values based on the selected tier level. Second, Micro-Meta App generates tier-specific descriptions of the microscope hardware and exports them in a Microscope file that can be used as a template and shared with the community, with a significant reduction in the recordkeeping burden. Then, in the Use Microscope modality, Micro-Meta App opens an existing Microscope file, imports Image Acquisition settings from the header of image data files to be annotated and interactively guides the user through the collection of all missing instrument-specific and tier-appropriate image acquisition settings and calibration metrics required to ensure reuse and reproducibility of image data. Finally, the App generates JSON files that contain comprehensive descriptions of the conditions utilized to produce individual microscopy datasets, and that can be stored on the user’s file system, or on third party repositories. To lower the barrier of adoption of Micro-Meta App by a wide community of users the application is available as a stand-alone program, as a plugin of the OMERO web client and as a service of the 4DN data portal.

## Installation
### Requirements
The Micro-Meta App Omero.web plugin requires a working Omero.server and Omero.web environment to be installated.
### Install
1.Download the latest release from [here](https://github.com/WU-BIMAC/MicroMetaApp-Omero/releases/latest).

2.Go the folder where you downloaded the package and run 
```
pip install -e .
```
Or if you prefer a manual installation unpack the file in your pluging folder (that should be added to your python path).

3.Add the plugin to your omero with
```
omero config append omero.web.apps '"omero_microMetaApp"'
```
4.Optionally add a top menu link with 
```
omero config append omero.web.ui.top_links '["Micro-Meta-App", "microMetaAppOmero_index", {"title": "Micro-Meta-App", "target": "_blank"}]'
```
