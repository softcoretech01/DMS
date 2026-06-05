from flask import jsonify


# =========================================
# MODULE DROPDOWN
# =========================================

def get_modules_dropdown():

    modules = [

        {

            'id': 1,
            'name': 'GST'

        },

        {

            'id': 2,
            'name': 'IncomeTax'

        },

        {

            'id': 3,
            'name': 'Audit'

        },

        {

            'id': 4,
            'name': 'General'

        }

    ]

    return jsonify({

        'modules': modules

    })

# =========================================
# DOCUMENT TYPES DROPDOWN
# =========================================

def get_document_types_dropdown():

    document_types = [

        {

            'id': 1,
            'name': 'Invoice'

        },

        {

            'id': 2,
            'name': 'Bill'

        },

        {

            'id': 3,
            'name': 'Report'

        },

        {

            'id': 4,
            'name': 'Tax Filing'

        },

        {

            'id': 5,
            'name': 'Audit Document'

        }

    ]

    return jsonify({

        'document_types': document_types

    })

# =========================================
# FINANCIAL YEARS DROPDOWN
# =========================================

def get_financial_years_dropdown():

    financial_years = [

        {

            'id': 1,
            'name': '2023-2024'

        },

        {

            'id': 2,
            'name': '2024-2025'

        },

        {

            'id': 3,
            'name': '2025-2026'

        },

        {

            'id': 4,
            'name': '2026-2027'

        }

    ]

    return jsonify({

        'financial_years': financial_years

    })

# =========================================
# ROLES DROPDOWN
# =========================================

def get_roles_dropdown():

    roles = [

        {

            'id': 1,
            'name': 'Admin'

        },

        {

            'id': 2,
            'name': 'Partner'

        },

        {

            'id': 3,
            'name': 'Manager'

        },

        {

            'id': 4,
            'name': 'Staff'

        },

        {

            'id': 5,
            'name': 'Client'

        }

    ]

    return jsonify({

        'roles': roles

    })

# =========================================
# SCREENS DROPDOWN
# =========================================

def get_screens_dropdown():

    screens = [

        {

            'id': 1,
            'name': 'Document Dashboard'

        },

        {

            'id': 2,
            'name': 'Folder Structure Manager'

        },

        {

            'id': 3,
            'name': 'Document Upload'

        },

        {

            'id': 4,
            'name': 'Document List View'

        },

        {

            'id': 5,
            'name': 'Document Detail View'

        },

        {

            'id': 6,
            'name': 'Document Tagging & Search'

        },

        {

            'id': 7,
            'name': 'Access Control & Permissions'

        },

        {

            'id': 8,
            'name': 'Bulk Upload / Download'

        },

        {

            'id': 9,
            'name': 'Document Reports'

        }

    ]

    return jsonify({

        'screens': screens

    })

# =========================================
# PERMISSION TYPES DROPDOWN
# =========================================

def get_permission_types_dropdown():

    permission_types = [

        {

            'id': 1,
            'name': 'View'

        },

        {

            'id': 2,
            'name': 'Upload'

        },

        {

            'id': 3,
            'name': 'Edit'

        },

        {

            'id': 4,
            'name': 'Delete'

        },

        {

            'id': 5,
            'name': 'Share'

        }

    ]

    return jsonify({

        'permission_types': permission_types

    })