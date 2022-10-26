from setuptools import setup, find_packages
from glob import glob

setup(
    name='omero-microMetaApp',
    version='1.7.25',
    description="OMERO.web plugin for Instrument and Image Acquisition Setting Metadata",
    packages=find_packages(exclude=['ez_setup']),
    keywords=['omero', 'microscope', 'metadata', 'micro-meta-app'],
    install_requires=['omero_web>=5.6.0'],
    include_package_data=True,
    zip_safe=False,

)
# data_files=[('omero_microMetaApp/static/microMetaAppOmero/images/png', glob('static/microMetaAppOmero/images/png/*')),
# ('omero_microMetaApp/static/microMetaAppOmero/images/svg',
# glob('static/microMetaAppOmero/images/svg/*')),
# ('omero_microMetaApp/static/microMetaAppOmero/css',
# glob('static/microMetaAppOmero/css/*')),
# ('omero_microMetaApp/static/microMetaAppOmero/js',
# glob('static/microMetaAppOmero/js/*')),
# ('omero_microMetaApp/static/microMetaAppOmero/script',
# glob('static/microMetaAppOmero/script/*')),
# ('omero_microMetaApp/static/microMetaAppOmero/script/dependency-jars',
# glob('static/microMetaAppOmero/script/dependency-jars/*')),
# ('omero_microMetaApp/templates/microMetaAppOmero', glob('templates/microMetaAppOmero/*'))],
