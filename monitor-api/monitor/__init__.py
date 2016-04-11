# -*- coding: utf-8 -*-

from monitor.app import MonitorApp


APP_NAME = 'blumenplace-monitor'

__version__ = '0.1.0'

__all__ = (
    'api',
    'app',
    'config',
    'exceptions',
    'field_validators',
    'models',
    'tokens',
    'userservice',
    'resources',

    'create_app'
)


def create_app(name, toml_file=None, dict_config=None):
    application = MonitorApp(name)
    if toml_file:
        application.config.from_toml(toml_file)
    if dict_config:
        application.config.from_dict(dict_config)
    return application
