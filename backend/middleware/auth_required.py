from functools import wraps

from flask import request, jsonify

from utils.jwt_helper import verify_token


def require_auth(f):

    @wraps(f)
    
    def decorated(*args, **kwargs):

        auth_header = request.headers.get(
            'Authorization'
        )

        if not auth_header:

            return jsonify({
                'error': 'Token missing'
            }), 401

        try:

            if auth_header.startswith('Bearer '):

                token = auth_header.split(' ')[1]

            else:

                token = auth_header

            payload =verify_token(token)

            request.user = payload

        except Exception as e:

            return jsonify({
                'error': 'Invalid token',
                'details': str(e)
            }), 401

        return f(*args, **kwargs)

    return decorated
