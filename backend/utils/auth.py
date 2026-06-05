from flask import Blueprint

from flasgger import swag_from

from controllers.auth_controller import login


auth_bp = Blueprint(

    'auth',

    __name__

)


# =========================================
# LOGIN
# =========================================

@auth_bp.route(

    '/login',

    methods=['POST']

)

@swag_from({

    'tags': ['Authentication'],

    'parameters': [

        {

            'name': 'body',

            'in': 'body',

            'required': True,

            'schema': {

                'type': 'object',

                'properties': {

                    'username': {

                        'type': 'string',

                        'example': 'john'

                    },

                    'password': {

                        'type': 'string',

                        'example': '123'

                    }

                },

                'required': [

                    'username',

                    'password'

                ]

            }

        }

    ],

    'responses': {

        200: {

            'description': 'Login successful'

        },

        401: {

            'description': 'Invalid credentials'

        }

    }

})

def login_route():

    return login()