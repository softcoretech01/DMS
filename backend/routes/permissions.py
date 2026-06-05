from flask import Blueprint
from controllers.permissions_controller import (
    get_user_permissions,
    update_role_permission,
    get_all_role_permissions
)

permissions_bp = Blueprint(
    'permissions',
    __name__
)

# User permissions
@permissions_bp.route(
    '/user/<int:user_id>',
    methods=['GET']
)
def user_permissions_route(user_id):

    return get_user_permissions(user_id)


# All role permissions
@permissions_bp.route(
    '/',
    methods=['GET']
)
def all_permissions_route():

    return get_all_role_permissions()


# Update permission
@permissions_bp.route(
    '/update',
    methods=['POST']
)
def update_permission_route():

    return update_role_permission()