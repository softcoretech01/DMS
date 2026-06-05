from flask import Blueprint

from controllers.users_controller import (
    get_users,
    create_user,
    update_user,
    delete_user

)

users_bp = Blueprint(
    'users',
    __name__
)


@users_bp.route(
    '/',
    methods=['GET']
)
def users_route():
    """
    Get all users
    ---
    tags:
      - Users

    responses:
      200:
        description: Users fetched successfully
    """
    return get_users()
@users_bp.route(
    '/',
    methods=['GET']
)
def get_users_route():

    return get_users()


@users_bp.route(
    '/create',
    methods=['POST']
)
def create_user_route():

    return create_user()

@users_bp.route(
    "/update/<int:user_id>",
    methods=["PUT"]
)
def update_user_route(user_id):

    return update_user(user_id)


@users_bp.route(
    "/delete/<int:user_id>",
    methods=["DELETE"]
)
def delete_user_route(user_id):

    return delete_user(user_id)