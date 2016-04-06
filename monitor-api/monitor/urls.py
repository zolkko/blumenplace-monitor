# -*- coding: utf-8 -*-

from monitor.api import MonitorApi
from monitor.resources.tokens import Tokens


def init(app):
    api = MonitorApi()
    app.logger.info('Routing initialization.')
    api.add_resource(Tokens, '/tokens')
    app.logger.info('Routing has been initialized.')

    api.init_app(app)
