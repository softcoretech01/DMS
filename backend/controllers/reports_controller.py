from flask import jsonify
from utils.db import get_conn

def get_report_summary():

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                "SELECT COUNT(*) total_users FROM users"
            )
            users = cursor.fetchone()

            cursor.execute(
                "SELECT COUNT(*) total_documents FROM documents"
            )
            documents = cursor.fetchone()

            cursor.execute(
                "SELECT COUNT(*) total_folders FROM folders"
            )
            folders = cursor.fetchone()

            cursor.execute("""
                SELECT
                    module,
                    COUNT(*) count
                FROM documents
                GROUP BY module
            """)
            modules = cursor.fetchall()

            cursor.execute("""
                SELECT
                    client_id,
                    COUNT(*) count
                FROM documents
                GROUP BY client_id
            """)
            clients = cursor.fetchall()

            cursor.execute("""
                SELECT
                    id,
                    name,
                    module,
                    document_type
                FROM documents
                ORDER BY id DESC
                LIMIT 10
            """)
            recent_documents = cursor.fetchall()

            return jsonify({

                "total_users":
                    users["total_users"],

                "total_documents":
                    documents["total_documents"],

                "total_folders":
                    folders["total_folders"],

                "modules":
                    modules,

                "clients":
                    clients,

                "recent_documents":
                    recent_documents

            })

    finally:

        conn.close()