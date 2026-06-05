import os
import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv

load_dotenv()


def get_conn():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=int(os.getenv('DB_PORT', '3306')),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', ''),
        charset='utf8mb4',
        cursorclass=DictCursor,
        autocommit=False,
    )


def call_proc(proc_name, params=None):
    """Call stored procedure and return all result sets.
    For MySQL, using cursor.callproc then cursor.fetchall for each result.
    """
    params = params or []
    conn = get_conn()
    try:
        with conn.cursor() as cursor:
            cursor.callproc(proc_name, params)
            results = []
            # first result
            try:
                results.append(cursor.fetchall())
            except Exception:
                results.append([])
            # next result sets
            while cursor.nextset():
                try:
                    results.append(cursor.fetchall())
                except Exception:
                    results.append([])
            return results
    finally:
        conn.close()


def execute(query, params=None):
    conn = get_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def get_connection():
    return get_conn()