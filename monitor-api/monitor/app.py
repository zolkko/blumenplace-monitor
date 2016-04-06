# -*- coding: utf-8 -*-

import sys
import os.path

from datetime import timedelta, datetime
from logging import basicConfig, BASIC_FORMAT, DEBUG
from logging.config import dictConfig as loggerDictConfig

from flask import Flask
from flask.json import JSONEncoder
from werkzeug.datastructures import ImmutableDict
from werkzeug.utils import cached_property

from monitor.api import MonitorApi
from monitor.config import MonitorConfig
from monitor.models import db
from monitor.resources import tokens


__all__ = (
    'MonitorJSONEncoder',
    'MonitorApp',
)


class MonitorJSONEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        else:
            return JSONEncoder.default(self, obj)


class MonitorApp(Flask):

    default_config = ImmutableDict({
        'DEBUG': True,
        'TESTING': False,
        'PROPAGATE_EXCEPTIONS': None,
        'PRESERVE_CONTEXT_ON_EXCEPTION': None,
        'SECRET_KEY': 'secret-password',
        'PERMANENT_SESSION_LIFETIME': timedelta(days=31),
        'USE_X_SENDFILE': False,
        'LOGGER_NAME': None,
        'SERVER_NAME': None,
        'APPLICATION_ROOT': None,
        'SESSION_COOKIE_NAME': 'session',
        'SESSION_COOKIE_DOMAIN': None,
        'SESSION_COOKIE_PATH': None,
        'SESSION_COOKIE_HTTPONLY': True,
        'SESSION_COOKIE_SECURE': False,
        'MAX_CONTENT_LENGTH': None,
        'SEND_FILE_MAX_AGE_DEFAULT': 12 * 60 * 60,
        'TRAP_BAD_REQUEST_ERRORS': False,
        'TRAP_HTTP_EXCEPTIONS': False,
        'PREFERRED_URL_SCHEME': 'http',
        'JSON_AS_ASCII': True,
        'JSON_SORT_KEYS': True,
        'JSONIFY_PRETTYPRINT_REGULAR': True,
    })

    def __init__(self, import_name, static_url_path=None, instance_path=None, instance_relative_config=False):
        super(MonitorApp, self).__init__(
            import_name=import_name, static_url_path=static_url_path, instance_path=instance_path,
            instance_relative_config=instance_relative_config)
        self.json_encoder = MonitorJSONEncoder

    @cached_property
    def private_key(self):
        file_path = self.config['jwt']['prv']

        if not os.path.isabs(file_path):
            file_path = os.path.abspath(file_path)

        with open(file_path, 'rt') as f:
            prv_key = f.read()
            self.logger.info('reading data from file')

        return prv_key

    @cached_property
    def public_key(self):
        file_path = self.config['jwt']['pub']

        if not os.path.isabs(file_path):
            file_path = os.path.abspath(file_path)

        with open(file_path, 'rt') as f:
            pub_key = f.read()

        return pub_key

    def make_config(self, instance_relative=False):
        root_path = self.root_path
        if instance_relative:
            root_path = self.instance_path
        return MonitorConfig(root_path, self.default_config)

    def init_loggers(self):
        logging_config = self.config.get('log')
        if logging_config:
            loggerDictConfig(logging_config)
        else:
            basicConfig(stream=sys.stdout, format=BASIC_FORMAT, level=DEBUG)

    def init_views(self):
        api = MonitorApi()

        self.logger.info('Routing initialization')
        api.add_resource(tokens.Tokens, '/tokens')
        self.logger.info('Routing has been initialized')

        api.init_app(self)

    def init_models(self):
        db.init_app(self)
        db.app = self
