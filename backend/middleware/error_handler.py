from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad Request', 'details': str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized', 'details': str(e)}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'error': 'Forbidden', 'details': str(e)}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not Found', 'details': str(e)}), 404

    @app.errorhandler(Exception)
    def unhandled(e):
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

