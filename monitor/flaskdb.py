# -*- coding: utf-8 -*-

from logging import getLogger

from flask import _app_ctx_stack

from monitor.models import ModelClass
from monitor.db import Database


logger = getLogger(__name__)


class FlaskDatabase(Database):
    def init_app(self, app):
        """
        Setup application instance.

        :param app: An :class:`flask.Flask` instance
        """
        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions['db'] = self

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
