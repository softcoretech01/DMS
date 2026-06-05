
from flask import request, jsonify

from utils.db import get_conn


def create_tag():

    data = request.json

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO tags(name)
                VALUES(%s)
                """,
                (
                    data.get('name'),
                )
            )

        conn.commit()

        return jsonify({
            'message': 'Tag created successfully'
        })

    finally:

        conn.close()


def get_tags():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM tags"
            )

            tags = cursor.fetchall()

        return jsonify(tags)

    finally:

        conn.close()
