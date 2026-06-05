from flask import jsonify

from utils.db import get_conn


# =========================================
# GET ACTIVITY LOGS
# =========================================

def get_activity_logs():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT *

                FROM activity_logs

                ORDER BY id DESC

                """

            )

            logs = cursor.fetchall()

        return jsonify(logs)

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()