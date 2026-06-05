from flask import request, jsonify
from utils.db import get_conn


# =========================
# CREATE FOLDER
# =========================

def create_folder():

    data = request.get_json()

    conn = get_conn()

    try:

        client_id = data.get('client_id')
        client_name = data.get('client_name')
        financial_year = data.get('financial_year')
        custom_folder = data.get('custom_folder')

        with conn.cursor() as cursor:

            # CLIENT

            cursor.execute(
                """
                INSERT INTO folders
                (
                    client_id,
                    parent_id,
                    name,
                    financial_year,
                    type
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    client_id,
                    None,
                    client_name,
                    financial_year,
                    'CLIENT'
                )
            )

            client_folder_id = cursor.lastrowid

            # YEAR

            cursor.execute(
                """
                INSERT INTO folders
                (
                    client_id,
                    parent_id,
                    name,
                    financial_year,
                    type
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    client_id,
                    client_folder_id,
                    financial_year,
                    financial_year,
                    'YEAR'
                )
            )

            year_folder_id = cursor.lastrowid

            # BILLS

            cursor.execute(
                """
                INSERT INTO folders
                (
                    client_id,
                    parent_id,
                    name,
                    financial_year,
                    type
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    client_id,
                    year_folder_id,
                    'Bills',
                    financial_year,
                    'BILLS'
                )
            )

            # GENERAL

            cursor.execute(
                """
                INSERT INTO folders
                (
                    client_id,
                    parent_id,
                    name,
                    financial_year,
                    type
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    client_id,
                    year_folder_id,
                    'General',
                    financial_year,
                    'GENERAL'
                )
            )

            # CUSTOM FOLDER

            if custom_folder:

                cursor.execute(
                    """
                    INSERT INTO folders
                    (
                        client_id,
                        parent_id,
                        name,
                        financial_year,
                        type
                    )
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (
                        client_id,
                        year_folder_id,
                        custom_folder,
                        financial_year,
                        'CUSTOM'
                    )
                )

        conn.commit()

        return jsonify({
            'message': 'Folder structure created successfully'
        })

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500

    finally:

        conn.close()


# =========================
# GET FOLDERS
# =========================

def get_folders():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM folders"
            )

            folders = cursor.fetchall()

        return jsonify(folders)

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500

    finally:

        conn.close()