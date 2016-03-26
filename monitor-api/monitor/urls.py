# -*- coding: utf-8 -*-

from .api import MonitorApi
from .resources import Tokens


def init(app):
    api = MonitorApi(app)
    app.logger.info('Routing initialization.')
    api.add_resource(Tokens, '/tokens')
    app.logger.info('Routing has been initialized.')
