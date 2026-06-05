import os

import zipfile

import tempfile

from datetime import datetime

from flask import (

    request,
    jsonify,
    current_app,
    send_file

)

from werkzeug.utils import secure_filename

from utils.db import get_conn

from utils.activity_logger import log_activity


# =========================================
# BULK UPLOAD
# =========================================


def bulk_upload():
    

    conn = None

    try:

        # =========================================
        # GET ZIP FILE
        # =========================================

        zip_file = request.files.get(

            'file'

        )

        if not zip_file:

            return jsonify({

                'error': 'ZIP file missing'

            }), 400

        # =========================================
        # VALIDATE ZIP
        # =========================================

        if not zip_file.filename.lower().endswith(

            '.zip'

        ):

            return jsonify({

                'error': 'Only ZIP files allowed'

            }), 400

        # =========================================
        # DATE
        # =========================================

        current_date = datetime.now()

        current_year = current_date.strftime(

            '%Y'

        )

        current_month = current_date.strftime(

            '%B'

        )

        # =========================================
        # STORAGE PATH
        # =========================================

        base_upload_dir = current_app.config[

            'UPLOAD_DIR'

        ]

        year_folder = os.path.join(

            base_upload_dir,
            current_year

        )

        os.makedirs(

            year_folder,

            exist_ok=True

        )

        # =========================================
        # CREATE ALL 12 MONTHS
        # =========================================

        months = [

            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'

        ]

        for month in months:

            os.makedirs(

                os.path.join(
                    year_folder,
                    month
                ),

                exist_ok=True

            )

        # =========================================
        # CURRENT MONTH FOLDER
        # =========================================

        upload_dir = os.path.join(

            year_folder,
            current_month

        )

        # =========================================
        # SAVE ZIP
        # =========================================

        zip_filename = secure_filename(

            zip_file.filename

        )

        zip_path = os.path.join(

            upload_dir,
            zip_filename

        )

        zip_file.save(

            zip_path

        )
        
        absolute_zip_path = os.path.abspath(

    zip_path

)

       

        # =========================================
        # DATABASE
        # =========================================

        conn = get_conn()

        with conn.cursor() as cursor:

            sql = """

            INSERT INTO documents(

                client_id,
                folder_id,
                module,
                document_type,
                name,
                description,
                uploaded_by,
                upload_date,
                status,
                version,
                file_path

            )

            VALUES(

                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s

            )

            """

            values = (

                1,
                None,
                'Bulk Upload',
                'ZIP File',
                zip_filename,
                'Bulk uploaded ZIP folder',
                1,
                datetime.now().date(),
                'Uploaded',
                1,
                absolute_zip_path

            )

            cursor.execute(

                sql,

                values

            )
            
        

            document_id = cursor.lastrowid

            # =========================================
            # INSERT VERSION
            # =========================================

            version_sql = """

            INSERT INTO document_versions(

                document_id,
                version_number,
                file_path,
                file_size,
                file_type,
                created_by

            )

            VALUES(

                %s,
                %s,
                %s,
                %s,
                %s,
                %s

            )

            """

            version_values = (

                document_id,
                1,
                 absolute_zip_path,
                os.path.getsize(zip_path),
                'zip',
                1

            )

            cursor.execute(

                version_sql,

                version_values

            )

            conn.commit()

            # =========================================
            # ACTIVITY LOG
            # =========================================

            log_activity(

                1,

                'BULK_UPLOAD',

                document_id,

                f'{zip_filename} bulk uploaded'

            )

        return jsonify({

            'message': 'Bulk upload successful',

            'zip_name': zip_filename,

            'stored_path': absolute_zip_path

        })

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        if conn:

            conn.close()


# =========================================
# BULK DOWNLOAD
# =========================================

def bulk_download():

    try:

        ids = request.args.get(

            'document_ids'

        )

        if not ids:

            return jsonify({

                'error': 'document_ids required'

            }), 400

        document_ids = [

            int(i)

            for i in ids.split(',')

        ]

        conn = get_conn()

        try:

            with conn.cursor() as cursor:

                placeholders = ','.join(

                    ['%s'] * len(document_ids)

                )

                sql = f"""

                SELECT

                    id,
                    name,
                    file_path

                FROM documents

                WHERE id IN ({placeholders})

                """

                cursor.execute(

                    sql,

                    tuple(document_ids)

                )

                documents = cursor.fetchall()

            if not documents:

                return jsonify({

                    'error': 'No documents found'

                }), 404

            # =========================================
            # TEMP ZIP
            # =========================================

            temp_zip = tempfile.NamedTemporaryFile(

                delete=False,

                suffix='.zip'

            )

            zip_path = temp_zip.name

            temp_zip.close()

            # =========================================
            # CREATE ZIP
            # =========================================

            with zipfile.ZipFile(

                zip_path,

                'w',

                zipfile.ZIP_DEFLATED

            ) as zipf:

                for doc in documents:

                    folder_path = doc['file_path']

                    document_name = doc['name']

                    if not folder_path:

                        continue

                    if not os.path.exists(

                        folder_path

                    ):

                        continue

                    # =========================================
                    # WALK THROUGH FOLDER
                    # =========================================

                    for root, dirs, files in os.walk(

                        folder_path

                    ):

                        for file in files:

                            full_path = os.path.join(

                                root,
                                file

                            )

                            relative_path = os.path.relpath(

                                full_path,
                                folder_path

                            )

                            zipf.write(

                                full_path,

                                arcname=os.path.join(
                                    document_name.replace('.zip', ''),
                                    relative_path
                                )

                            )

            return send_file(

                zip_path,

                as_attachment=True,

                download_name='bulk_download.zip',

                mimetype='application/zip'

            )

        finally:

            conn.close()

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500


# =========================================
# FOLDER DOWNLOAD
# =========================================

def folder_download(folder_id):

    try:

        conn = get_conn()

        try:

            with conn.cursor() as cursor:

                sql = """

                SELECT

                    id,
                    name,
                    file_path

                FROM documents

                WHERE folder_id = %s

                """

                cursor.execute(

                    sql,

                    (folder_id,)

                )

                documents = cursor.fetchall()

            if not documents:

                return jsonify({

                    'error': 'No documents found'

                }), 404

            # =========================================
            # TEMP ZIP
            # =========================================

            temp_zip = tempfile.NamedTemporaryFile(

                delete=False,

                suffix='.zip'

            )

            zip_path = temp_zip.name

            temp_zip.close()

            # =========================================
            # CREATE ZIP
            # =========================================

            with zipfile.ZipFile(

                zip_path,

                'w',

                zipfile.ZIP_DEFLATED

            ) as zipf:

                for doc in documents:

                    file_path = doc['file_path']

                    document_name = doc['name']

                    if not file_path:

                        continue

                    if not os.path.exists(

                        file_path

                    ):

                        continue

                    # =========================================
                    # DIRECTORY
                    # =========================================

                    if os.path.isdir(

                        file_path

                    ):

                        for root, dirs, files in os.walk(

                            file_path

                        ):

                            for file in files:

                                full_path = os.path.join(

                                    root,
                                    file

                                )

                                relative_path = os.path.relpath(

                                    full_path,
                                    file_path

                                )

                                zipf.write(

                                    full_path,

                                    arcname=os.path.join(
                                        document_name.replace('.zip', ''),
                                        relative_path
                                    )

                                )

                    # =========================================
                    # SINGLE FILE
                    # =========================================

                    else:

                        zipf.write(

                            file_path,

                            arcname=document_name

                        )

            return send_file(

                zip_path,

                as_attachment=True,

                download_name=f'folder_{folder_id}.zip',

                mimetype='application/zip'

            )

        finally:

            conn.close()

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500