from flask import Blueprint

from flasgger import swag_from

from controllers.dropdowns_controller import (

    get_modules_dropdown,
    get_document_types_dropdown,
    get_financial_years_dropdown,
    get_roles_dropdown,
    get_screens_dropdown,
    get_permission_types_dropdown


)

# =========================================
# BLUEPRINT
# =========================================

dropdowns_bp = Blueprint(

    'dropdowns',

    __name__

)

# =========================================
# MODULES DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/modules',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Modules dropdown'

        }

    }

})

def modules_dropdown_route():

    return get_modules_dropdown()

# =========================================
# DOCUMENT TYPES DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/document-types',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Document types dropdown'

        }

    }

})

def document_types_dropdown_route():

    return get_document_types_dropdown()

# =========================================
# FINANCIAL YEARS DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/financial-years',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Financial years dropdown'

        }

    }

})

def financial_years_dropdown_route():

    return get_financial_years_dropdown()

# =========================================
# ROLES DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/roles',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Roles dropdown'

        }

    }

})

def roles_dropdown_route():

    return get_roles_dropdown()

# =========================================
# SCREENS DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/screens',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Screens dropdown'

        }

    }

})

def screens_dropdown_route():

    return get_screens_dropdown()

# =========================================
# PERMISSION TYPES DROPDOWN
# =========================================

@dropdowns_bp.route(

    '/permission-types',

    methods=['GET']

)

@swag_from({

    'tags': ['Dropdowns'],

    'responses': {

        200: {

            'description': 'Permission types dropdown'

        }

    }

})

def permission_types_dropdown_route():

    return get_permission_types_dropdown()