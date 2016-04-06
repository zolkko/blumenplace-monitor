# -*- coding: utf-8 -*-

from __future__ import absolute_import

import sys

from flask import current_app, _request_ctx_stack
from flask.signals import got_request_exception
from flask_restful import Api
from flask_restful.utils import cors, http_status_message
from werkzeug.exceptions import HTTPException


__all__ = ('MonitorApi', )


ORIGIN = '*'
HEADERS = ('Content-Type', 'X-Access-Token', )
MAX_AGE = 21600


class MonitorApi(Api):

    def __init__(self, *args, **kwargs):
        super(MonitorApi, self).__init__(*args, prefix='/api/v1', **kwargs)
        self.decorators = (
            cors.crossdomain(origin=ORIGIN, headers=HEADERS, max_age=MAX_AGE),
        )

    def get_default_exception_headers(self):

        def get_methods():
            adapter = _request_ctx_stack.top.url_adapter
            if hasattr(adapter, 'allowed_methods'):
                methods = adapter.allowed_methods()
            else:
                methods = []
            return ', '.join(map(str.upper, methods))

        def get_allowed_header():
            return ', '.join(map(str.upper, HEADERS))

        return [
            ('Access-Control-Allow-Origin',  ORIGIN),
            ('Access-Control-Allow-Headers', get_allowed_header()),
            ('Access-Control-Allow-Methods', get_methods()),
            ('Access-Control-Max-Age', str(MAX_AGE))
        ]

    def handle_error(self, e):
        if isinstance(e, HTTPException):
            got_request_exception.send(current_app._get_current_object(), exception=e)

            code = e.code
            data = getattr(e, 'data', {
                'message': getattr(e, 'description', http_status_message(code))
            })
            headers = self.get_default_exception_headers()

            if code >= 500:
                exc_info = sys.exc_info()
                if exc_info[1] is None:
                    exc_info = None
                current_app.log_exception(exc_info)

            error_cls_name = type(e).__name__
            if error_cls_name in self.errors:
                custom_data = self.errors.get(error_cls_name, {})
                code = custom_data.get('status', 500)
                data.update(custom_data)

            resp = self.make_response(data, code, headers)

            if code == 401:
                resp = self.unauthorized(resp)

            return resp
        else:
            return super(MonitorApi, self).handle_error(e)
