from flask import request, jsonify
from functools import wraps
from utils.db import call_proc


def require_permission(action, resource='document'):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # For now, document actions validated via sp_check_document_permission when resource is document.
            user = getattr(request, 'user', None)
            if not user:
                return jsonify({'error': 'Unauthorized'}), 401

            # expected kwargs: document_id
            document_id = kwargs.get('document_id') or kwargs.get('id')
            if resource == 'document' and document_id is not None:
                res = call_proc('sp_check_document_permission', [user['id'], int(document_id), action])
                allowed = bool(res[0][0].get('allowed')) if res and res[0] else False
                if not allowed:
                    return jsonify({'error': 'Forbidden', 'details': f'Missing permission: {action}'}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator

