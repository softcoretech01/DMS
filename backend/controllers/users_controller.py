from flask import jsonify, request

from utils.db import get_conn


def get_users():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                """
            )

            users = cursor.fetchall()

        return jsonify(users)

    finally:

        conn.close()
        
def delete_user(user_id):

    return jsonify({
        "message": "Delete User API Working"
    })    
    
def update_user(user_id):

    return jsonify({
        "message": "Update User API Working"
    })        
        
def create_user():

    data = request.get_json()

    print("USER DATA =", data)

    role_name = ""

    if data["role_id"] == 1:
        role_name = "Admin"

    elif data["role_id"] == 3:
        role_name = "Manager"

    elif data["role_id"] == 4:
        role_name = "Staff"

    elif data["role_id"] == 5:
        role_name = "Client"

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO users
                (
                    name,
                    email,
                    username,
                    password,
                    role,
                    role_id
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    data["name"],
                    data["email"],
                    data["username"],
                    data["password"],
                    role_name,
                    data["role_id"]
                )
            )

            conn.commit()

            return jsonify({
                "message": "User Created"
            })

    finally:

        conn.close()