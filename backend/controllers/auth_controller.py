from flask import request, jsonify

from utils.db import get_conn

from utils.jwt_helper import generate_token


# =========================================
# LOGIN
# =========================================

def login():

    data = request.get_json()

    username = data.get(

        'username'

    )

    password = data.get(

        'password'

    )

    if not username or not password:

        return jsonify({

            'error': 'Username and password required'

        }), 400

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            sql = """

            SELECT *

            FROM users

            WHERE username = %s

            AND password = %s

            """

            cursor.execute(

                sql,

                (

                    username,
                    password

                )

            )

            user = cursor.fetchone()

            if not user:

                return jsonify({

                    'error': 'Invalid credentials'

                }), 401

            token = generate_token(

                user

            )

            return jsonify({

                'message': 'Login successful',

                'token': token,
                
            'user': {

                 'id': user['id'],

                 'username': user['username'],

                 'name': user['name'],

                 'role': user['role'],

                 'role_id': user['role_id']

                    }    


            })

    finally:

        conn.close()