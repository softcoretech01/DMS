import jwt

from datetime import datetime, timedelta


SECRET_KEY = 'dms_secret_key'


# =========================================
# GENERATE TOKEN
# =========================================

def generate_token(user):

    payload = {

        'user_id': user['id'],

        'role_id': user['role_id'],

        'exp': datetime.utcnow() + timedelta(hours=24)

    }

    token = jwt.encode(

        payload,

        SECRET_KEY,

        algorithm='HS256'

    )

    return token


# =========================================
# VERIFY TOKEN
# =========================================

def verify_token(token):

    try:

        decoded = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=['HS256']

        )

        return decoded

    except Exception:

        return None