from flask import Blueprint

from controllers.folders_controller import (

    create_folder,
    get_folders

)

from flasgger import swag_from


folders_bp = Blueprint(

    'folders',

    __name__

)


# =========================
# GET FOLDERS
# =========================

@folders_bp.route(

    '/',

    methods=['GET']

)

@swag_from({

    'tags': ['Folders'],

    'responses': {

        200: {

            'description': 'Get all folders'

        }

    }

})

def get_folders_route():

    return get_folders()


# =========================
# CREATE FOLDER
# =========================

@folders_bp.route(

    '/',

    methods=['POST']

)

@swag_from({

    'tags': ['Folders'],

    'parameters': [

        {

            'name': 'body',

            'in': 'body',

            'required': True,

            'schema': {

                'type': 'object',

                'properties': {

                    'client_id': {

                        'type': 'integer'

                    },

                    'client_name': {

                        'type': 'string'

                    },

                    'financial_year': {

                        'type': 'string'

                    }

                }

            }

        }

    ],

    'responses': {

        200: {

            'description': 'Folder structure created successfully'

        }

    }

})

def create_folder_route():

    return create_folder()