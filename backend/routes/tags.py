from flask import Blueprint

from controllers.tags_controller import (
    create_tag,
    get_tags
)

tags_bp = Blueprint(
    'tags',
    __name__
)


@tags_bp.route(
    '/',
    methods=['GET']
)
def tags_list():
    """
    Get all tags
    ---
    tags:
      - Tags

    responses:
      200:
        description: Tags fetched successfully
    """
    return get_tags()


@tags_bp.route(
    '/',
    methods=['POST']
)
def tags_create():
    """
    Create new tag
    ---
    tags:
      - Tags

    parameters:
      - in: body
        name: body
        schema:
          type: object
          properties:
            name:
              type: string
            predefined:
              type: boolean

    responses:
      200:
        description: Tag created
    """
    return create_tag()

