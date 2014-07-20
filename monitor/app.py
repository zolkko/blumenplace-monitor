# -*- coding: utf-8 -*-

import sys
import os

from argparse import ArgumentParser

from anyjson import deserialize
from flask import Flask


__all__ = ('start_app', )


class MonitorApp(Flask):
    APP_NAME = 'monitor'

    def __init__(self, *kwargs):
        """
        static_path='', static_url_path='', static_folder='', template_folder='', instance_path=''

        :param kwargs:
        :return:
        """
        super(MonitorApp, self).__init__(MonitorApp.APP_NAME, **kwargs)


def create_arg_parser():
    parser = ArgumentParser()
    parser.add_argument()
    return parser


def get_configuration():
    parser = create_arg_parser()
    args = parser.parse_args(sys.argv[1:])
    if args.config and os.path.isfile(args.config):
        with open(args.config, 'rt') as config_file:
            configuration = deserialize(config_file.read())
    else:
        parser.print_help()


def start_app():
    parser = create_arg_parser()
    args = parser.parse_args(sys.argv[1:])
    if args.config and os.path.isfile(args.config):
        with open(args.config, 'rt') as config_file:
            configuration = deserialize(config_file.read())

        app = MonitorApp()
        app.config.from_object(configuration)
        app.run()
    else:
        parser.print_help()
