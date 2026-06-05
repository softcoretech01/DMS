from flask import Blueprint

from flasgger import swag_from


from controllers.documents_controller import (

    get_documents,
    get_document,
    search_documents,
    upload_document,
    update_document,
    delete_document,
    share_document,
    download_document,
    preview_document,
    multi_upload_documents,
    get_document_versions,
    add_document_version,


)

# =========================================
# BLUEPRINT
# =========================================

documents_bp = Blueprint(

    'documents',

    __name__

)

# =========================================
# GET ALL DOCUMENTS
# =========================================

@documents_bp.route(

    '/',

    methods=['GET']

)

@swag_from({

    'tags': ['Documents'],

    'parameters': [

        {

            'name': 'client_id',

            'in': 'query',

            'type': 'integer',

            'required': False,

            'description': 'Filter by client ID'

        },

        {

            'name': 'document_type',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'Filter by document type'

        },

        {

            'name': 'status',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'Filter by status'

        },

        {

            'name': 'module',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'Filter by module'

        },

        {

            'name': 'from',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'Start date'

        },

        {

            'name': 'to',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'End date'

        }

        ,
        {
            'name': 'tag',

            'in': 'query',

            'type': 'string',

            'required': False,

           'description': 'Filter by tag'
        }

    ],

    'responses': {

        200: {

            'description': 'Get all documents'

        }

    }

})

def get_documents_route():

    return get_documents()


# =========================================
# GET SINGLE DOCUMENT
# =========================================

@documents_bp.route(

    '/<int:document_id>',

    methods=['GET']

)

@swag_from({

    'security': [

    {

        'Bearer': []

    }

],

    'tags': ['Documents'],

    'parameters': [

        {

            'name': 'document_id',

            'in': 'path',

            'type': 'integer',

            'required': True,

            'description': 'Document ID'

        }

    ],

    'responses': {

        200: {

            'description': 'Get single document'

        },

        404: {

            'description': 'Document not found'

        }

    }

})

def get_single_document_route(document_id):

    return get_document(document_id)


# =========================================
# SEARCH DOCUMENTS
# =========================================

@documents_bp.route(

    '/search',

    methods=['GET']

)

@swag_from({

    'tags': ['Documents'],

    'parameters': [

        {

            'name': 'q',

            'in': 'query',

            'type': 'string',

            'required': False,

            'description': 'Search query'

        }

    ],

    'responses': {

        200: {

            'description': 'Search documents'

        }

    }

})

def search_documents_route():

    return search_documents()


# =========================================
# UPLOAD DOCUMENT
# =========================================

@documents_bp.route(

    '/upload',

    methods=['POST']

)

@swag_from({

    'tags': ['Documents'],

    'security': [

        {

            'Bearer': []

        }

    ],

    'consumes': [

        'multipart/form-data'

    ],

    'parameters': [

        {

            'name': 'file',

            'in': 'formData',

            'type': 'file',

            'required': True,

            'description': 'Upload file'

        },

        {

            'name': 'client_id',

            'in': 'formData',

            'type': 'integer',

            'required': True,

            'description': 'Client ID'

        },

        {

            'name': 'folder_id',

            'in': 'formData',

            'type': 'integer',

            'required': False,

            'description': 'Folder ID'

        },

        {

            'name': 'module',

            'in': 'formData',

            'type': 'string',

            'required': True,

            'description': 'Module Name'

        },

        {

            'name': 'document_type',

            'in': 'formData',

            'type': 'string',

            'required': True,

            'description': 'Document Type'

        },

        {

            'name': 'description',

            'in': 'formData',

            'type': 'string',

            'required': False,

            'description': 'Document Description'

        }

    ],

    'responses': {

        200: {

            'description': 'Document uploaded successfully'

        },

        401: {

            'description': 'Unauthorized'

        }

    }

})

def upload_document_route():

    return upload_document()

# =========================================
# DELETE DOCUMENT
# =========================================

@documents_bp.route(

    '/<int:document_id>',

    methods=['DELETE']

)

@swag_from({

    'tags': ['Documents'],

    'security': [

        {

            'Bearer': []

        }

    ],

    'parameters': [

        {

            'name': 'document_id',

            'in': 'path',

            'type': 'integer',

            'required': True,

            'description': 'Document ID'

        }

    ],

    'responses': {

        200: {

            'description': 'Document deleted successfully'

        },

        401: {

            'description': 'Unauthorized'

        },

        403: {

            'description': 'Permission denied'

        }

    }

})

def delete_single_document_route(document_id):

    return delete_document(document_id)

# =========================================
# SHARE DOCUMENT
# =========================================

@documents_bp.route(

    '/share',

    methods=['POST']

)

@swag_from({

    'tags': ['Documents'],

    'parameters': [

        {

            'name': 'body',

            'in': 'body',

            'required': True,

            'schema': {

                'type': 'object',

                'properties': {

                    'document_id': {

                        'type': 'integer'

                    },

                    'shared_to': {

                        'type': 'string'

                    }

                }

            }

        }

    ],

    'responses': {

        200: {

            'description': 'Document shared successfully'

        }

    }

})

def share_document_route():

    return share_document()

# =========================================
# DOWNLOAD DOCUMENT
# =========================================

@documents_bp.route(

    '/download/<int:document_id>',

    methods=['GET']

)

@swag_from({

    'tags': ['Documents'],

    'security': [

        {

            'Bearer': []

        }

    ],

    'parameters': [

        {

            'name': 'document_id',

            'in': 'path',

            'type': 'integer',

            'required': True,

            'description': 'Document ID'

        }

    ],

    'responses': {

        200: {

            'description': 'Document download successful'

        }

    }

})

def download_document_route(document_id):

    return download_document(document_id)

# =========================================
# PREVIEW DOCUMENT
# =========================================

@documents_bp.route(

    '/preview/<int:document_id>',

    methods=['GET']

)

@swag_from({

    'tags': ['Documents'],

    'security': [

        {

            'Bearer': []

        }

    ],

    'parameters': [

        {

            'name': 'document_id',

            'in': 'path',

            'type': 'integer',

            'required': True,

            'description': 'Document ID'

        }

    ],

    'responses': {

        200: {

            'description': 'Document preview successful'

        }

    }

})

def preview_document_route(document_id):

    return preview_document(document_id)

# =========================================
# MULTI FILE UPLOAD
# =========================================

@documents_bp.route(

    '/multi-upload',

    methods=['POST']

)

@swag_from({

    'tags': ['Documents'],

    'security': [

        {

            'Bearer': []

        }

    ],

    'consumes': [

        'multipart/form-data'

    ],

    'parameters': [

        {

            'name': 'files',

            'in': 'formData',

            'type': 'array',
            
    'items': {
            'type': 'file'
            },

    'collectionFormat': 'multi',

            'description': 'Upload multiple files'

        },

        {

            'name': 'client_id',

            'in': 'formData',

            'type': 'integer',

            'required': True

        },

        {

            'name': 'folder_id',

            'in': 'formData',

            'type': 'integer',

            'required': False

        },

        {

            'name': 'module',

            'in': 'formData',

            'type': 'string',

            'required': True

        },

        {

            'name': 'document_type',

            'in': 'formData',

            'type': 'string',

            'required': True

        },

        {

            'name': 'description',

            'in': 'formData',

            'type': 'string',

            'required': False

        }

    ],

    'responses': {

        200: {

            'description': 'Multi upload successful'

        }

    }

})

def multi_upload_documents_route():

    return multi_upload_documents()


# =========================================
# DOCUMENT VERSION HISTORY
# =========================================
@documents_bp.route(
    '/versions/<int:document_id>',
    methods=['GET']
)
def get_document_versions_route(document_id):

    return get_document_versions(document_id)


@documents_bp.route(
    '/version',
    methods=['POST']
)
def add_document_version_route():

    return add_document_version()