# -*- coding: utf-8 -*-

from flask import current_app, request
from flask_restful import reqparse

from monitor.tokens import create_token, token_required, current_identity
from monitor.field_validators import email_validator
from monitor.resources.base import BaseResource
from monitor.models import db
from monitor.userservice import UserService


__all__ = ('Tokens', )


def collect_token_response(access_token, expire_at):
    return {
        'accessToken': access_token,
        'expireAt': expire_at.isoformat()
    }


class Tokens(BaseResource):

    methods = ('POST', 'GET')

    def __init__(self):
        super(Tokens, self).__init__()
        self.sign_in_parser = reqparse.RequestParser(bundle_errors=True)
        self.sign_in_parser.add_argument('email', type=email_validator, required=True, location=['json'])
        self.sign_in_parser.add_argument(
            'password', type=str, required=True, location=['json'], help='password field is required')

    def post(self):
        args = self.sign_in_parser.parse_args(request, strict=True)

        user_service = UserService(db.session)
        user = user_service.get(args['email'], args['password'])

        access_token, expire_at = create_token(user.id, user.email)
        current_app.logger.info('Access token has been generated for user %s' % (user.id, ))

        return collect_token_response(access_token, expire_at)

    @token_required
    def get(self):
        user_id = current_identity.get('id')
        email = current_identity.get('email')

        access_token, expire_at = create_token(user_id, email)
        current_app.logger.info('Access token has been regenerated for user %s' % (email, ))

        return collect_token_response(access_token, expire_at)
