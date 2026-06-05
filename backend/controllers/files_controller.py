import os

from flask import (

    request,
    jsonify,
    send_file,
    current_app

)

from werkzeug.utils import secure_filename

from utils.db import get_conn


# UPLOAD FILE

def upload_file():

    try:

        file = request.files.get('file')

        if not file:

            return jsonify({

                'error': 'No file selected'

            }), 400

        filename = secure_filename(

            file.filename

        )

        upload_dir = current_app.config[

            'UPLOAD_DIR'

        ]

        os.makedirs(

            upload_dir,

            exist_ok=True

        )

        file_path = os.path.join(

            upload_dir,

            filename

        )

        file.save(file_path)

        return jsonify({

            'message': 'File uploaded successfully',

            'filename': filename

        })

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500


# DOWNLOAD FILE USING FILE ID

def download_file(file_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT

                    id,
                    name

                FROM documents

                WHERE id = %s

                """,

                (file_id,)
            )

            file_data = cursor.fetchone()

            if not file_data:

                return jsonify({

                    'error': 'File not found'

                }), 404

            filename = file_data['name']

            upload_path = os.path.join(

                'storage',
                'uploads',
                filename

            )

            if not os.path.exists(upload_path):

                return jsonify({

                    'error': 'Physical file missing'

                }), 404

            return send_file(

                upload_path,

                as_attachment=True

            )

    finally:

        conn.close()