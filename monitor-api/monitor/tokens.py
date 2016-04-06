# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from functools import wraps
from itertools import chain

from flask import request, current_app, _request_ctx_stack
from jwt import decode as jwt_decode, encode as jwt_encode, DecodeError
from jwt.exceptions import ExpiredSignatureError
from pytz import UTC
from werkzeug.local import LocalProxy

from monitor.exceptions import MonitorException


__all__ = (
    'current_identity',
    'create_token',
    'token_required'
)


current_identity = LocalProxy(lambda: getattr(_request_ctx_stack.top, 'current_identity', {}))


def create_token(user_id, email):
    jwt_cfg = current_app.config['jwt']
    alg = jwt_cfg['alg']
    exp = int(jwt_cfg['exp'])
    nbf = int(jwt_cfg['nbf'])

    utc_now = datetime.utcnow().replace(tzinfo=UTC)
    expire_at = utc_now + timedelta(seconds=exp)
    not_before = utc_now + timedelta(seconds=nbf)

    access_token = jwt_encode({
        'iat': utc_now,
        'exp': expire_at,
        'nbf': not_before,
        'user': {
            'id': user_id,
            'email': email
        }
    }, current_app.private_key, algorithm=alg)

    return access_token.decode('utf-8'), expire_at


def token_required(func):

    @wraps(func)
    def decorator(*args, **kwargs):
        global current_identity

        jwt_cfg = current_app.config['jwt']
        alg = jwt_cfg['alg']
        leeway = jwt_cfg['leeway']
        header = jwt_cfg['header']
        jwt_options = dict(chain(
            map(lambda x: ('verify_' + x, True), jwt_cfg.get('verify_claims', [])),
            map(lambda x: ('require_' + x, True), jwt_cfg.get('required_claims', []))
        ))

        access_token = request.headers.get(header)
        if not access_token:
            raise MonitorException(403)

        try:
            access_data = jwt_decode(
                access_token,
                current_app.public_key,
                algorithm=alg,
                leeway=leeway,
                options=jwt_options)
        except (DecodeError, ExpiredSignatureError) as error:
            current_app.logger.error(error)
            raise MonitorException(403)

        user = access_data.get('user')
        if not user:
            raise MonitorException(403)

        current_identity.update(user)

        return func(*args, **kwargs)

    return decorator
