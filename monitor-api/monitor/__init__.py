# -*- coding: utf-8 -*-

from argparse import ArgumentParser
from monitor.app import MonitorApp


APP_NAME = 'blumenplace-monitor'

__version__ = '0.1.0'

__all__ = (
    'app',
    'config',
    'models',
    'userservice',

    'parse_arguments',
    'create_app'
)


def parse_arguments(args):
    """
    :param args: sys.argv[1:]
    :return:
    """
    parser = ArgumentParser(prog='blumenplace-monitor')
    parser.add_argument('-c', '--config', action='store', type=str)
    parser.add_argument('-e', '--env', action='store', type=str)
    return parser.parse_args(args)


def create_app(name, toml_file=None, dict_config=None):
    application = MonitorApp(name)
    if toml_file:
        application.config.from_toml(toml_file)
    if dict_config:
        application.config.from_dict(dict_config)
    return application
