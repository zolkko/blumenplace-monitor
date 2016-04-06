# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from functools import wraps

from flask import request, current_app, _request_ctx_stack
from jwt import decode as jwt_decode, encode as jwt_encode, DecodeError
from jwt.exceptions import ExpiredSignatureError
from pytz import UTC
from werkzeug.local import LocalProxy

from monitor.exceptions import MonitorException


__all__ = (
    'current_identity',
    'MonitorException',
    'create_token',
    'token_required'
)

DEFAULT_ALG = 'RS256'

ACCESS_TOKEN_HEADER = 'X-Access-Token'

current_identity = LocalProxy(lambda: getattr(_request_ctx_stack.top, 'current_identity', {}))


def create_token(user_id, email):
    utc_now = datetime.utcnow().replace(tzinfo=UTC)
    expire_at = utc_now + timedelta(seconds=30)

    access_token = jwt_encode({
        'iat': utc_now,
        'exp': expire_at,
        'user': {
            'id': user_id,
            'email': email
        }
    }, current_app.private_key, algorithm=DEFAULT_ALG)

    return access_token.decode('utf-8'), expire_at


def token_required(func):

    @wraps(func)
    def decorator(*args, **kwargs):
        global current_identity

        access_token = request.headers.get(ACCESS_TOKEN_HEADER)
        if not access_token:
            raise MonitorException(403)

        try:
            options = {
                'verify_signature': True,
                'verify_exp': True,
                'verify_iat': True,
                'require_exp': True,
                'require_iat': True
            }
            access_data = jwt_decode(access_token, current_app.public_key, algorithm=DEFAULT_ALG, options=options)
        except (DecodeError, ExpiredSignatureError) as error:
            current_app.logger.error(error)
            raise MonitorException(403)

        user = access_data.get('user')
        if not user:
            raise MonitorException(403)

        current_identity.update(user)

        return func(*args, **kwargs)

    return decorator
