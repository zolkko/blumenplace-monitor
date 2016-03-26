# -*- coding: utf-8 -*-

from logging import getLogger

from flask import _app_ctx_stack
from sqlalchemy import create_engine

from monitor.models import ModelClass
from monitor.db import Database


logger = getLogger(__name__)


class FlaskDatabase(Database):
    """
    TODO: instantiate configuration data only when it is required. But until then
     keep it in string format.
    """

    def __init__(self, model_class, config_dict):
        config = FlaskDatabase.parse_config_dict(config_dict)
        super(FlaskDatabase, self).__init__(model_class, config)

    @staticmethod
    def parse_config_dict(config_dict):
        config = {}
        for key, connection_data in config_dict.items():
            config[key] = create_engine(connection_data['connection'], **connection_data['options'])
        return config

    def init_app(self, app):
        """
        Setup application instance.

        :param app: An :class:`flask.Flask` instance
        """
        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions[FlaskDatabase.__name__] = self

        @app.teardown_appcontext
        def shutdown_session(response_or_exc):
            self.session.remove()
            return response_or_exc

    def get_scope_func(self):
        return _app_ctx_stack.__ident_func__


def init(app, config):
    logger.info('Initializing database.')
    db = FlaskDatabase(ModelClass, config)
    db.init_app(app)
    logger.info('Database has been initialized.')
