# -*- coding: utf-8 -*-

from flask_restful import Resource, reqparse

import jwt
from flask import current_app, request

from .field_validators import email_validator

# current_identity = LocalProxy(lambda: getattr(_request_ctx_stack.top, 'current_identity', None))


class Tokens(Resource):

    methods = ['POST']

    def __init__(self, *args, **kwargs):
        super(Tokens, self).__init__(*args, **kwargs)

        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('email', type=email_validator, required=True, location=['json'])
        parser.add_argument('password', type=str, required=True, location=['json'],
                            help='password field is required')
        self.SIGNIN_PARSER = parser

    def post(self):
        args = self.SIGNIN_PARSER.parse_args(request, strict=True)

        access_token = jwt.encode({
            'id': 1,
            'email': args['email']
        }, current_app.private_key, algorithm='RS256')

        return {
            'access_token': access_token.decode()
        }
