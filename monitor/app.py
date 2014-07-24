# -*- coding: utf-8 -*-

from logging import getLogger

from flask import Flask


__all__ = ('MonitorApp', )


logger = getLogger(__name__)


class MonitorApp(Flask):

    APP_NAME = 'monitor'

    def __init__(self, config):
        super(MonitorApp, self).__init__(
            MonitorApp.APP_NAME,
            static_url_path=config.get('staticUrl', None),
            static_folder=config.get('staticFolder', 'static'),
            template_folder=config.get('templateFolder', 'templates')
        )
