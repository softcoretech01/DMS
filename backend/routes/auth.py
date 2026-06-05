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

@auth_bp.route("/login", methods=["POST"])
def login_route():
    return login()

@swag_from({

    'tags': ['Authentication'],

    'consumes': [

        'application/json'

    ],

    'parameters': [

        {

            'name': 'body',

            'in': 'body',

            'required': True,

            'schema': {

                'type': 'object',

                'required': [

                    'username',

                    'password'

                ],

                'properties': {

                    'username': {

                        'type': 'string',

                        'example': 'john'

                    },

                    'password': {

                        'type': 'string',

                        'example': '123'

                    }

                }

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