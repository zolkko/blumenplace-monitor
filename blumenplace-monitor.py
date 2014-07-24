# -*- coding: utf-8 -*-

import sys

from argparse import ArgumentParser, FileType
from logging import getLogger, basicConfig, BASIC_FORMAT, DEBUG
from logging.config import dictConfig as loggerDictConfig

from anyjson import deserialize

from monitor.app import MonitorApp
from monitor.flaskdb import init as init_db
from monitor.views import init as init_views


def create_argument_parser():
    parser = ArgumentParser(prog='blumenplace-monitor')
    parser.add_argument('-c', '--config', action='store', type=FileType(mode='rt', encoding='utf-8'))
    return parser


def read_configuration(parser):
    options = parser.parse_args(sys.argv[1:])

    config_data = None

    if options.config:
        config_data = deserialize(options.config.read())
        options.config.close()
    else:
        parser.print_help()

    return config_data


def init_loggers(logger_config):
    if logger_config:
        loggerDictConfig(logger_config)
    else:
        basicConfig(stream=sys.stdout, format=BASIC_FORMAT, level=DEBUG)


def main():
    parser = create_argument_parser()
    config = read_configuration(parser)

    init_loggers(config.get('loggers', {}))

    logger = getLogger(__name__)
    logger.info('blumenplace-monitor application initialized.')

    try:
        app = MonitorApp(config)

        init_db(app, None)
        init_views(app)

        app.run()
    except Exception as ex:
        logger.critical('blumenplace-monitor critical exception. Reason: {}.'.format(ex))

    logger.info('blumenplace-monitor application finished.')


if __name__ == '__main__':
    main()
