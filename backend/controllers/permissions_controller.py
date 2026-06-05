from flask import jsonify, request
from utils.db import get_conn

def get_user_permissions(user_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    rp.screen_id,
                    s.screen_name,
                    rp.can_view,
                    rp.can_upload,
                    rp.can_edit,
                    rp.can_delete,
                    rp.can_share
                FROM users u
                JOIN role_permissions rp
                    ON u.role_id = rp.role_id
                JOIN screens s
                    ON rp.screen_id = s.id
                WHERE u.id = %s
                """,
                (user_id,)
            )

            permissions = cursor.fetchall()

            return jsonify(permissions)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        conn.close()
        


def get_all_role_permissions():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:
            
            cursor.execute(
    """
    SELECT
        rp.id,
        rp.role_id,
        r.name AS role_name,
        rp.screen_id,
        s.screen_name,
        rp.can_view,
        rp.can_upload,
        rp.can_edit,
        rp.can_delete,
        rp.can_share
    FROM role_permissions rp
    JOIN roles r
        ON rp.role_id = r.id
    JOIN screens s
        ON rp.screen_id = s.id
    ORDER BY rp.role_id, rp.screen_id
    """
)
            
    

            data = cursor.fetchall()

            return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        conn.close()    
        
     
        
def update_role_permission():

    data = request.get_json()

    role_id = data.get("role_id")
    screen_id = data.get("screen_id")
    permission = data.get("permission")
    value = data.get("value")

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            sql = f"""
            UPDATE role_permissions
            SET {permission} = %s
            WHERE role_id = %s
            AND screen_id = %s
            """

            cursor.execute(
                sql,
                (
                    value,
                    role_id,
                    screen_id
                )
            )

            conn.commit()

            return jsonify({
                "message": "Permission Updated"
            })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        conn.close()