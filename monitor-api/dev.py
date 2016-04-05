# -*- coding: utf-8 -*-

import sys

from logging import getLogger

from monitor import create_app, parse_arguments


def main():
    options = parse_arguments(sys.argv[1:])

    try:
        application = create_app('blumenplace-monitor-dev', toml_file=options.config)
        application.init_loggers()
        application.init_models()
        application.init_views()
        application.run(debug=True, use_debugger=True, use_reloader=False)
    except Exception as ex:
        logger = getLogger()
        logger.critical(ex)


if __name__ == '__main__':
    main()
