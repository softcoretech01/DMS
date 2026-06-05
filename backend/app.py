import os

from flask import Flask

from flask_cors import CORS

from flasgger import Swagger

from routes.dropdowns import dropdowns_bp

# =========================
# ROUTES
# =========================


from routes.users import users_bp
from routes.clients import clients_bp
from routes.folders import folders_bp
from routes.tags import tags_bp
from routes.documents import documents_bp
from routes.files import files_bp
from routes.reports import reports_bp
from routes.bulk import bulk_bp
from routes.auth import auth_bp
from routes.activity import activity_bp
from routes.permissions import permissions_bp

# =========================
# MIDDLEWARE
# =========================

from middleware.error_handler import (
    register_error_handlers
)

from middleware.auth_middleware import (
    register_auth_error_handlers
)

from middleware.auth_required import (
    require_auth
)



# =========================
# SWAGGER CONFIG
# =========================

swagger_template = {

    "swagger": "2.0",

    "info": {

        "title": "DMS API",

        "description": "Document Management System API",

        "version": "1.0"

    },

    "securityDefinitions": {

        "Bearer": {

            "type": "apiKey",

            "name": "Authorization",

            "in": "header",

            "description": "Enter: Bearer <JWT_TOKEN>"

        }

    }

}



# =========================
# CREATE APP
# =========================

def create_app():

    app = Flask(__name__)

    Swagger(
        app,
        template=swagger_template
    )

    # =========================
    # CONFIG
    # =========================

    app.config['JSON_SORT_KEYS'] = False

    app.config['UPLOAD_DIR'] = os.getenv(

        'UPLOAD_DIR',

        os.path.join(
            app.root_path,
            'storage',
            'uploads'
        )
    )

    # =========================
    # FILE SIZE LIMIT
    # =========================

    app.config['MAX_CONTENT_LENGTH'] = (

        500 * 1024 * 1024

    )

    # =========================
    # CORS
    # =========================

    CORS(

        app,

        resources={

            r"/api/*": {

                "origins": os.getenv(
                    'CORS_ORIGINS',
                    '*'
                )
            }
        },

        supports_credentials=True,
    )

    # =========================
    # REGISTER BLUEPRINTS
    # =========================

    app.register_blueprint(
        auth_bp,
        url_prefix='/api/auth'
    )

    app.register_blueprint(
        users_bp,
        url_prefix='/api/users'
    )

    app.register_blueprint(
        clients_bp,
        url_prefix='/api/clients'
    )

    app.register_blueprint(
        folders_bp,
        url_prefix='/api/folders'
    )

    app.register_blueprint(
        tags_bp,
        url_prefix='/api/tags'
    )

    app.register_blueprint(
        documents_bp,
        url_prefix='/api/documents'
    )

    app.register_blueprint(
        files_bp,
        url_prefix='/api/files'
    )

    app.register_blueprint(
        reports_bp,
        url_prefix='/api/reports'
    )

    app.register_blueprint(
        bulk_bp,
        url_prefix='/api/bulk'
    )

    app.register_blueprint(
        activity_bp,
        url_prefix='/api/activity'
    )

    app.register_blueprint(

        dropdowns_bp,

        url_prefix='/api/dropdowns'

    )
    
    app.register_blueprint(
        permissions_bp,
        url_prefix="/api/permissions"
     )

    # =========================
    # ERROR HANDLERS
    # =========================

    register_error_handlers(app)

    register_auth_error_handlers(app)

    # =========================
    # HOME ROUTE
    # =========================

    @app.route('/')

    def home():

        return {

            'message': 'DMS Backend Running Successfully'

        }

    # =========================
    # HEALTH CHECK
    # =========================

    @app.route('/health')

    def health():

        return {

            'status': 'ok'

        }

    return app


# =========================
# RUN SERVER
# =========================

if __name__ == '__main__':

    app = create_app()

    port = int(

        os.getenv(
            'PORT',
            '5000'
        )
    )

    app.run(

        host='0.0.0.0',

        port=port,

        debug=os.getenv(
            'FLASK_DEBUG',
            '0'
        ) == '1'
    )