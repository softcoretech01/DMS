import os

from datetime import datetime

from flask import send_file

from utils.permission_checker import check_permission

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
# GET ALL DOCUMENTS + FILTERS
# =========================================

def get_documents():

    client_id = request.args.get('client_id')
    document_type = request.args.get('document_type')
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    status = request.args.get('status')
    module = request.args.get('module')
    tag = request.args.get('tag')

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            sql = """
                SELECT *
                FROM documents
                WHERE 1=1
            """

            values = []

            # CLIENT FILTER
            if client_id:
                sql += " AND client_id = %s"
                values.append(client_id)

            # DOCUMENT TYPE FILTER
            if document_type:
                sql += " AND document_type = %s"
                values.append(document_type)

            # STATUS FILTER
            if status:
                sql += " AND status = %s"
                values.append(status)

            # MODULE FILTER
            if module:
                sql += " AND module = %s"
                values.append(module)

            # TAG FILTER
            if tag:
                sql += """
                    AND id IN (
                        SELECT dt.document_id
                        FROM document_tags dt
                        JOIN tags t
                        ON dt.tag_id = t.id
                        WHERE t.name = %s
                    )
                """
                values.append(tag)

            # DATE RANGE FILTER
            if from_date and to_date:
                sql += """
                    AND upload_date
                    BETWEEN %s AND %s
                """
                values.append(from_date)
                values.append(to_date)

            sql += " ORDER BY id DESC"

            cursor.execute(
                sql,
                tuple(values)
            )

            documents = cursor.fetchall()

            return jsonify(documents)

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500

    finally:

        conn.close()  

        
        
        
# =========================================
# GET SINGLE DOCUMENT
# =========================================
def get_document(document_id):
    

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT *

                FROM documents

                WHERE id = %s

                """,

                (document_id,)
            )

            document = cursor.fetchone()

            if not document:

                return jsonify({

                    'error': 'Document not found'

                }), 404
                
                
# =========================================
# GET TAGS
# =========================================

            cursor.execute(
                """
                SELECT t.name
                FROM tags t
                JOIN document_tags dt
                    ON t.id = dt.tag_id
                WHERE dt.document_id = %s
                """,
                (document_id,)
            )

            tag_rows = cursor.fetchall()

            document['tags'] = [
                tag['name']
                for tag in tag_rows
            ]
            
            
            
            # =========================================
            # GET CLIENT
            # =========================================

            client_name = None

            if document.get('client_id'):

                cursor.execute(
                    """
                    SELECT name
                    FROM clients
                    WHERE id = %s
                    """,
                    (document['client_id'],)
                )

                client = cursor.fetchone()

                if client:
                    client_name = client['name']
                    document['client_name'] = client_name

            # =========================================
            # GET FOLDER
            # =========================================

            folder_name = None

            if document.get('folder_id'):

                cursor.execute(
                    """
                    SELECT name
                    FROM folders
                    WHERE id = %s
                    """,
                    (document['folder_id'],)
                )

                folder = cursor.fetchone()

                if folder:
                    folder_name = folder['name']

            # =========================================
            # LINKED RECORDS
            # =========================================

            document['linked_records'] = []



            if folder_name:

                document['linked_records'].append({
                    'id': 2,
                    'name': folder_name,
                    'type': 'Folder'
                })
                
                            # =========================================
            # COMPLIANCE RECORDS
            # =========================================

            cursor.execute(
                """
                SELECT compliance_name
                FROM compliance_records
                WHERE document_id = %s
                """,
                (document_id,)
            )

            compliance_rows = cursor.fetchall()

            for row in compliance_rows:

                document['linked_records'].append({
                    'name': row['compliance_name'],
                    'type': 'Compliance'
                })

            # =========================================
            # TASK RECORDS
            # =========================================

            cursor.execute(
                """
                SELECT task_name
                FROM task_records
                WHERE document_id = %s
                """,
                (document_id,)
            )

            task_rows = cursor.fetchall()

            for row in task_rows:

                document['linked_records'].append({
                    'name': row['task_name'],
                    'type': 'Task'
                })   
                
                     
            
            
            
            
            
            
            
            

        return jsonify(document)

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()
        
        


# =========================================
# SEARCH DOCUMENTS
# =========================================

def search_documents():

    query = request.args.get(

        'q',

        ''

    )

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            sql = """

                SELECT *

                FROM documents

                WHERE

                    name LIKE %s
                    OR module LIKE %s
                    OR document_type LIKE %s
                    OR description LIKE %s

                ORDER BY id DESC

            """

            search = f"%{query}%"

            cursor.execute(

                sql,

                (

                    search,
                    search,
                    search,
                    search

                )
            )

            documents = cursor.fetchall()

        return jsonify(documents)

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()

# =========================================
# UPLOAD DOCUMENT
# =========================================
@check_permission(

    'Documents',

    'can_upload'

)

def upload_document():

    try:

        file = request.files.get('file')

        if not file:

            return jsonify({

                'error': 'No file uploaded'

            }), 400

        # =========================================
        # ORIGINAL + SAFE NAME
        # =========================================

        original_filename = file.filename

        safe_filename = secure_filename(

            original_filename

        )

        # =========================================
        # YEAR + MONTH
        # =========================================

        current_date = datetime.now()

        current_year = current_date.strftime(

            '%Y'

        )

        current_month = current_date.strftime(

            '%B'

        )

        # =========================================
        # BASE UPLOAD DIRECTORY
        # =========================================

        base_upload_dir = current_app.config[

            'UPLOAD_DIR'

        ]

        # =========================================
        # CREATE YEAR FOLDER
        # =========================================

        year_folder = os.path.join(

            base_upload_dir,
            current_year

        )

        os.makedirs(

            year_folder,

            exist_ok=True

        )

        # =========================================
        # CREATE ALL 12 MONTH FOLDERS
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

            month_path = os.path.join(

                year_folder,
                month

            )

            os.makedirs(

                month_path,

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
        # FINAL FILE PATH
        # =========================================

        file_path = os.path.join(

            upload_dir,
            safe_filename

        )

        # =========================================
        # SAVE FILE
        # =========================================

        file.save(file_path)

        # =========================================
        # ABSOLUTE PATH
        # =========================================

        absolute_path = os.path.abspath(

            file_path

        )

        # =========================================
        # FORM DATA
        # =========================================

        client_id = request.form.get(

            'client_id'

        )

        folder_id = request.form.get(

            'folder_id'

        )

        module = request.form.get(

            'module'

        )

        document_type = request.form.get(

            'document_type'

        )

        description = request.form.get(

            'description'

        )
        
        tag_id = request.form.get(

            'tag_id'

)

        # =========================================
        # DATABASE
        # =========================================

        conn = get_conn()

        try:

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

                    client_id,
                    folder_id if folder_id else None,
                    module,
                    document_type,
                    original_filename,
                    description,
                    1,
                    datetime.now().date(),
                    'Uploaded',
                    1,
                    absolute_path

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
                    absolute_path,
                    os.path.getsize(file_path),
                    file.content_type,
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

                    'UPLOAD',

                    document_id,

                    f'{original_filename} uploaded'

                )

                return jsonify({

                    'message': 'Document uploaded successfully',

                    'saved_as': safe_filename,

                    'original_name': original_filename,

                    'year_folder': current_year,

                    'month_folder': current_month,

                    'file_path': absolute_path

                })

        finally:

            conn.close()

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

# =========================================
# UPDATE DOCUMENT
# =========================================

def update_document(document_id):

    data = request.get_json()

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT *

                FROM documents

                WHERE id = %s

                """,

                (document_id,)
            )

            existing = cursor.fetchone()

            if not existing:

                return jsonify({

                    'error': 'Document not found'

                }), 404

            name = data.get(

                'name'

            ) or existing['name']

            module = data.get(

                'module'

            ) or existing['module']

            document_type = data.get(

                'document_type'

            ) or existing['document_type']

            description = data.get(

                'description'

            ) or existing['description']

            status = data.get(

                'status'

            ) or existing['status']

            version = data.get(

                'version'

            ) or existing['version']

            sql = """

                UPDATE documents

                SET

                    name = %s,
                    module = %s,
                    document_type = %s,
                    description = %s,
                    status = %s,
                    version = %s

                WHERE id = %s

            """

            values = (

                name,
                module,
                document_type,
                description,
                status,
                version,
                document_id

            )

            cursor.execute(

                sql,

                values

            )

            conn.commit()

            log_activity(

                1,

                'UPDATE',

                document_id,

                'Document updated'

            )

            return jsonify({

                'message': 'Document updated successfully'

            })

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()


# =========================================
# DELETE DOCUMENT
# =========================================
@check_permission(

    'Documents',

    'can_delete'

)

def delete_document(document_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                DELETE FROM document_versions

                WHERE document_id = %s

                """,

                (document_id,)
            )

            cursor.execute(

                """

                DELETE FROM documents

                WHERE id = %s

                """,

                (document_id,)
            )

            conn.commit()

            log_activity(

                1,

                'DELETE',

                document_id,

                'Document deleted'

            )

            return jsonify({

                'message': 'Document deleted successfully'

            })

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()


# =========================================
# SHARE DOCUMENT
# =========================================
@check_permission(

    'Documents',

    'can_share'

)

def share_document():

    data = request.get_json()

    document_id = data.get(

        'document_id'

    )

    shared_to = data.get(

        'shared_to'

    )

    if not document_id or not shared_to:

        return jsonify({

            'error': 'document_id and shared_to required'

        }), 400

    return jsonify({

        'message': 'Document shared successfully',

        'document_id': document_id,

        'shared_to': shared_to

    })

# =========================================
# DOWNLOAD DOCUMENT
# =========================================

def download_document(document_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT

                    name,
                    file_path

                FROM documents

                WHERE id = %s

                """,

                (document_id,)

            )

            document = cursor.fetchone()

            if not document:

                return jsonify({

                    'error': 'Document not found'

                }), 404

            file_path = document['file_path']

            file_name = document['name']

            if not os.path.exists(file_path):

                return jsonify({

                    'error': 'File missing in storage'

                }), 404

            return send_file(

                file_path,

                as_attachment=True,

                download_name=file_name

            )

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()

# =========================================
# PREVIEW DOCUMENT
# =========================================

def preview_document(document_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                SELECT

                    name,
                    file_path

                FROM documents

                WHERE id = %s

                """,

                (document_id,)

            )

            document = cursor.fetchone()

            if not document:

                return jsonify({

                    'error': 'Document not found'

                }), 404

            file_path = document['file_path']

            if not file_path:

                return jsonify({

                    'error': 'File path missing'

                }), 404

            if not os.path.exists(file_path):

                return jsonify({

                    'error': 'File missing in storage'

                }), 404

            return send_file(

                file_path,

                as_attachment=False

            )

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500

    finally:

        conn.close()

# =========================================
# MULTI FILE UPLOAD
# =========================================

def multi_upload_documents():

    try:

        files = request.files.getlist(

            'files'

        )

        if not files:

            return jsonify({

                'error': 'No files uploaded'

            }), 400

        client_id = request.form.get(

            'client_id'

        )

        folder_id = request.form.get(

            'folder_id'

        )

        module = request.form.get(

            'module'

        )

        document_type = request.form.get(

            'document_type'

        )

        description = request.form.get(

            'description'

        )
        tag_id = request.form.get(
           'tag_id'
)

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
        # STORAGE
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
        # CREATE 12 MONTHS
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

        upload_dir = os.path.join(

            year_folder,
            current_month

        )

        conn = get_conn()

        uploaded_files = []

        try:

            with conn.cursor() as cursor:

                for file in files:

                    if not file:

                        continue

                    original_filename = file.filename

                    safe_filename = secure_filename(

                        original_filename

                    )

                    file_path = os.path.join(

                        upload_dir,
                        safe_filename

                    )

                    file.save(file_path)

                    absolute_path = os.path.abspath(

                        file_path

                    )

                    # =========================================
                    # INSERT DOCUMENT
                    # =========================================

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

                        client_id,
                        folder_id if folder_id else None,
                        module,
                        document_type,
                        original_filename,
                        description,
                        1,
                        datetime.now().date(),
                        'Uploaded',
                        1,
                        absolute_path

                    )

                    cursor.execute(

                        sql,

                        values

                    )

                    document_id = cursor.lastrowid
                    
                    

                    # =========================================
                    # VERSION INSERT
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
                        absolute_path,
                        os.path.getsize(file_path),
                        file.content_type,
                        1

                    )

                    cursor.execute(

                        version_sql,

                        version_values

                    )

                    log_activity(

                        1,

                        'MULTI_UPLOAD',

                        document_id,

                        f'{original_filename} uploaded'

                    )

                    uploaded_files.append({

                        'document_id': document_id,
                        'file_name': original_filename,
                        'file_path': absolute_path

                    })

                conn.commit()

            return jsonify({

                'message': 'Multi file upload successful',

                'total_uploaded': len(uploaded_files),

                'uploaded_files': uploaded_files

            })

        finally:

            conn.close()

    except Exception as e:

        return jsonify({

            'error': str(e)

        }), 500
        
def get_document_versions(document_id):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT *
                FROM document_versions
                WHERE document_id = %s
                ORDER BY version_number DESC
                """,
                (document_id,)
            )

            data = cursor.fetchall()

            return jsonify(data)

    finally:

        conn.close()
        
def add_document_version():

    try:

        document_id = request.form.get('document_id')
        file = request.files.get('file')

        if not document_id:
            return jsonify({
                "error": "document_id required"
            }), 400

        if not file:
            return jsonify({
                "error": "No file selected"
            }), 400

        conn = get_conn()

        try:

            with conn.cursor() as cursor:

                # Latest version number
                cursor.execute(
                    """
                    SELECT MAX(version_number) AS latest_version
                    FROM document_versions
                    WHERE document_id = %s
                    """,
                    (document_id,)
                )

                result = cursor.fetchone()

                latest_version = (
                    result['latest_version']
                    if result['latest_version']
                    else 0
                )

                new_version = latest_version + 1

                # Original document path
                cursor.execute(
                    """
                    SELECT file_path
                    FROM documents
                    WHERE id = %s
                    """,
                    (document_id,)
                )

                doc = cursor.fetchone()

                if not doc:
                    return jsonify({
                        "error": "Document not found"
                    }), 404

                old_path = doc['file_path']

                upload_dir = os.path.dirname(old_path)

                safe_filename = secure_filename(
                    file.filename
                )

                file_path = os.path.join(
                    upload_dir,
                    safe_filename
                )

                file.save(file_path)

                absolute_path = os.path.abspath(
                    file_path
                )

                cursor.execute(
                    """
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
                    """,
                    (
                        document_id,
                        new_version,
                        absolute_path,
                        os.path.getsize(file_path),
                        file.content_type,
                        1
                    )
                )

                conn.commit()

                return jsonify({
                    "message": "Version uploaded successfully",
                    "version_number": new_version
                })

        finally:

            conn.close()

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
