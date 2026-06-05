from functools import wraps

from flask import (
    jsonify,
    request
)

from utils.db import get_conn
from utils.jwt_helper import verify_token


def check_permission(
    screen_name,
    permission_type
):

    def decorator(f):

        @wraps(f)
        def wrapper(*args, **kwargs):

            try:

                # =========================================
                # DEBUG HEADERS
                # =========================================

                print("\n========== DEBUG ==========")
                print("AUTH HEADER = ", request.headers.get("Authorization"))
                print("ALL HEADERS = ", dict(request.headers))
                print("===========================\n")

                # =========================================
                # GET TOKEN
                # =========================================

                auth_header = request.headers.get(
                    'Authorization'
                )

                if not auth_header:

                    return jsonify({
                        'error': 'Token missing'
                    }), 401

                # =========================================
                # EXTRACT TOKEN
                # =========================================

                try:

                    if auth_header.startswith("Bearer "):

                        token = auth_header.split(" ")[1]

                    else:

                        token = auth_header

                except Exception:

                    return jsonify({
                        'error': 'Invalid token format'
                    }), 401

                # =========================================
                # VERIFY TOKEN
                # =========================================

                decoded = verify_token(token)

                if not decoded:

                    return jsonify({
                        'error': 'Invalid or expired token'
                    }), 401

                user_id = decoded['user_id']

                # =========================================
                # DB CONNECTION
                # =========================================

                conn = get_conn()

                try:

                    with conn.cursor() as cursor:

                        # =========================================
                        # GET USER ROLE
                        # =========================================

                        cursor.execute(
                            """
                            SELECT role_id
                            FROM users
                            WHERE id = %s
                            """,
                            (user_id,)
                        )

                        user = cursor.fetchone()

                        if not user:

                            return jsonify({
                                'error': 'User not found'
                            }), 404

                        role_id = user['role_id']

                        # =========================================
                        # CHECK ROLE PERMISSION
                        # =========================================

                        sql = f"""
                        SELECT rp.{permission_type}
                        FROM role_permissions rp
                        JOIN screens s
                        ON rp.screen_id = s.id
                        WHERE
                            rp.role_id = %s
                            AND s.screen_name = %s
                        """

                        cursor.execute(
                            sql,
                            (
                                role_id,
                                screen_name
                            )
                        )

                        permission = cursor.fetchone()

                        if not permission:

                            return jsonify({
                                'error': 'Permission not configured'
                            }), 403

                        allowed = list(
                            permission.values()
                        )[0]

                        if not allowed:

                            return jsonify({
                                'error': 'Permission denied'
                            }), 403

                finally:

                    conn.close()

                return f(
                    *args,
                    **kwargs
                )

            except Exception as e:

                print("PERMISSION ERROR =", str(e))

                return jsonify({
                    'error': str(e)
                }), 500

        return wrapper

    return decorator