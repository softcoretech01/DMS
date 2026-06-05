from flask import request, jsonify


def get_bearer_token():
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return None


def unauthorized(message):
    return jsonify({'error': 'Unauthorized', 'details': message}), 401

