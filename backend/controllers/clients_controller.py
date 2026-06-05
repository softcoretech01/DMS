from flask import jsonify
from utils.db import get_connection


def get_clients():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.callproc(
        'sp_get_clients'
    )

    clients = []

    for result in cursor.stored_results():
        clients = result.fetchall()

    return jsonify(clients)