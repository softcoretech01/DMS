
from flask import Blueprint, request, jsonify

from utils.db import get_conn

clients_bp = Blueprint(
    'clients',
    __name__
)


@clients_bp.route(
    '/',
    methods=['GET']
)
def get_clients():
    """
    Get all clients
    ---
    tags:
      - Clients

    responses:
      200:
        description: Clients fetched
    """

    conn = get_conn()

    try:

        with conn.cursor() as cur:

            cur.execute(
                "SELECT * FROM clients"
            )

            clients = cur.fetchall()

        return jsonify(clients), 200

    finally:
        conn.close()


@clients_bp.route(
    '/',
    methods=['POST']
)
def create_client():
    """
    Create client
    ---
    tags:
      - Clients

    parameters:
      - in: body
        name: body
        schema:
          type: object
          properties:
            name:
              type: string

    responses:
      200:
        description: Client created
    """

    data = request.get_json()

    name = data.get('name')

    conn = get_conn()

    try:

        with conn.cursor() as cur:

            cur.execute(

                """
                INSERT INTO clients(name)
                VALUES(%s)
                """,

                (name,)
            )

        conn.commit()

        return jsonify({
            'message': 'Client created successfully'
        })

    finally:
        conn.close()
