from utils.db import get_conn


def log_activity(

    user_id,
    action,
    document_id,
    details

):

    conn = get_conn()

    try:

        with conn.cursor() as cursor:

            cursor.execute(

                """

                INSERT INTO activity_logs(

                    user_id,
                    action,
                    document_id,
                    details

                )

                VALUES(%s,%s,%s,%s)

                """,

                (

                    user_id,
                    action,
                    document_id,
                    details

                )
            )

        conn.commit()

    finally:

        conn.close()