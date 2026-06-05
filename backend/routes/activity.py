from flask import Blueprint

from controllers.activity_controller import (

    get_activity_logs

)

from flasgger import swag_from


activity_bp = Blueprint(

    'activity',

    __name__

)


@activity_bp.route(

    '/',

    methods=['GET']

)

@swag_from({

    'tags': ['Activity Logs'],

    'responses': {

        200: {

            'description': 'Get activity logs'

        }

    }

})

def get_activity_logs_route():

    return get_activity_logs()