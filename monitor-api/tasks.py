# -*- coding: utf-8 -*-

import sys
import os

import inspect

from logging import WARN, INFO, DEBUG, getLogger
from logging.config import dictConfig

from alembic.config import Config
from alembic import command

from contoml import load as toml_load

from invoke import task
from invoke.collection import Collection
from invoke.parser import Parser, ParserContext, Argument
from invoke.executor import Executor
from invoke.exceptions import Exit, Failure, ParseError

from monitor import create_app


dictConfig({
    'version': 1,
    'loggers': {
        'root': {
            'level': WARN,
            'handlers': ['console']
        },
        'tasks': {
            'level': DEBUG,
            'handlers': ['console']
        },
        'sqlalchemy': {
            'level': WARN,
            'handlers': ['console'],
            'qualname': 'sqlalchemy.engine'
        },
        'alembic': {
            'level': INFO,
            'handlers': ['console'],
            'qualname': 'alembic'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'generic',
            'level': DEBUG
        }
    },
    'formatters': {
        'generic': {
            'format': '%(levelname)-5.5s [%(name)s] %(message)s',
            'datefmt': '%H:%M:%S'
        },
    }
})

log = getLogger('tasks')


DEFAULT_CONFIG = 'config.develop.toml'


@task(name='db-delete', optional=('config', ), help={
    'config': 'path to service`s configuration file'
})
def db_delete(config=DEFAULT_CONFIG):
    """clean database"""
    toml = toml_load(os.path.join(os.path.dirname(__file__), config)).primitive

    connection_string = toml['SQLALCHEMY_DATABASE_URI']

    if connection_string.startswith('sqlite:///'):
        log.info('detected %s sqlalchemy provider' % (connection_string, ))
        db_file = connection_string.replace('sqlite:///', '')
        if os.path.exists(db_file):
            log.info('delete file %s' % (db_file, ))
            os.unlink(db_file)
        else:
            log.info('file %s does not exists' % (db_file, ))
    else:
        log.info('unsupported sql provider: %s' % (connection_string, ))


@task(name='db-migrate', optional=('config', ), help={
    'config': 'path to service`s configuration file'
})
def db_migrate(config=DEFAULT_CONFIG):
    """migrate database"""

    toml = toml_load(os.path.join(os.path.dirname(__file__), config)).primitive

    alembic_cfg = Config()
    alembic_cfg.set_main_option('script_location', 'alembic')
    alembic_cfg.set_main_option('sqlalchemy.url', toml['SQLALCHEMY_DATABASE_URI'])

    command.upgrade(alembic_cfg, 'head')


@task(db_delete, db_migrate, name='db')
def db_init():
    """initialize data by firstly deleting it and then recreating"""
    pass


@task(name='dev-server', optional=('config', ), help={
    'config': 'path to service`s configuration file'
})
def dev_server(config=DEFAULT_CONFIG):
    """start development server"""
    try:
        application = create_app('blumenplace-monitor-dev', toml_file=config)
        application.init_loggers()
        application.init_models()
        application.init_views()
        application.run(debug=True, use_debugger=True, use_reloader=True)
    except Exception as ex:
        logger = getLogger()
        logger.critical(ex)


if __name__ == '__main__':
    """this is used to start development server under debugger"""
    parser_context = ParserContext(args=dev_server.get_arguments())
    parser = Parser(initial=parser_context, ignore_unknown=True)

    try:
        options = parser.parse_argv(sys.argv[1:])[0]
    except ParseError as error:
        sys.exit(str(error))

    collection = Collection()
    collection.add_task(dev_server, default=True)

    try:
        executor = Executor(collection)
        executor.execute((collection.default, options.as_kwargs))
    except Exit as e:
        exit(e.code)
    except Failure as f:
        exit(f.result.exited)
