from flask import Blueprint

from controllers.files_controller import (
    upload_file,
    download_file
)

from flasgger import swag_from


files_bp = Blueprint(
    'files',
    __name__
)


# =========================
# UPLOAD FILE
# =========================

@files_bp.route(
    '/upload',
    methods=['POST']
)

@swag_from({

    'tags': ['Files'],

    'consumes': [
        'multipart/form-data'
    ],

    'parameters': [

        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'Choose file'
        }

    ],

    'responses': {

        200: {
            'description': 'File uploaded successfully'
        }

    }

})

def upload_file_route():

    return upload_file()


# =========================
# DOWNLOAD FILE
# =========================

@files_bp.route(
    '/download/<int:file_id>',
    methods=['GET']
)

@swag_from({

    'tags': ['Files'],

    'parameters': [

        {
            'name': 'file_id',
            'in': 'path',
            'type': 'integer',
            'required': True
        }

    ],

    'responses': {

        200: {
            'description': 'File downloaded successfully'
        }

    }

})

def download_file_route(file_id):

    return download_file(file_id)