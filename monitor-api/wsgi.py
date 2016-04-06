# -*- coding: utf-8 -*-

from werkzeug.wsgi import DispatcherMiddleware

import monitor


flask_app = monitor.create_app('blumenplace-monitor', dict_config={
    'LOGGER_NAME': 'app',
    'staticFolder': '/app/static',
    'staticUrl': '/static',
    'templateFolder': 'templates',
    'jwt': {
        'pub': '/etc/bpmon/ca/bpmon.pub',
        'prv': '/etc/bpmon/ca/bpmon.prv'
    },
    'log': {
        'version': 1,
        'incremental': False,
        'disable_existing_loggers': True,
        'root': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
        'loggers': {
            'app': {
                'level': 'DEBUG',
                'handlers': ['console']
            }
        },
        'handlers': {
            'null': {
                'level': 'DEBUG',
                'class': 'logging.NullHandler'
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'formatter': 'default'
            }
        },
        'formatters': {
            'default': {
                'format': '[%(levelname)s]P:%(process)d T:%(thread)d %(asctime)s %(name)s.%(funcName)s: %(message)s',
                'datefmt': '%Y-%b-%d %H:%M:%S'
            }
        }
    }
})
flask_app.init_loggers()
flask_app.init_models()
flask_app.init_views()

application = DispatcherMiddleware(flask_app)
