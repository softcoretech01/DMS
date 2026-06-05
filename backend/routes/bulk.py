from flask import Blueprint

from flasgger import swag_from

from controllers.bulk_controller import (

    bulk_upload,
    bulk_download,
    folder_download

)

bulk_bp = Blueprint(

    'bulk',

    __name__

)

# =========================================
# BULK UPLOAD
# =========================================

@bulk_bp.route(

    '/upload',

    methods=['POST']

)

@swag_from({

    'tags': ['Bulk Operations']

})

def bulk_upload_route():

    return bulk_upload()


# =========================================
# BULK DOWNLOAD
# =========================================

@bulk_bp.route(

    '/download',

    methods=['GET']

)

@swag_from({

    'tags': ['Bulk Operations']

})

def bulk_download_route():

    return bulk_download()


# =========================================
# FOLDER DOWNLOAD
# =========================================

@bulk_bp.route(
    '/folder-download/<int:folder_id>',
    methods=['GET']
)
def download_folder(folder_id):

    return folder_download(folder_id)


@swag_from({

    'tags': ['Bulk Operations']

})

def folder_download_route(folder_id):

    return folder_download(folder_id)