# -*- coding: utf-8 -*-

import os

from logging import WARN, INFO, DEBUG, getLogger
from logging.config import dictConfig

from alembic.config import Config
from alembic import command

from contoml import load as toml_load

from invoke import task


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

toml = toml_load(os.path.join(os.path.dirname(__file__), 'config.devel.toml')).primitive

log = getLogger('tasks')


@task(name='db-delete')
def db_delete():
    """clean database"""
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


@task(name='db-migrate')
def db_migrate():
    """migrate database"""

    alembic_cfg = Config()
    alembic_cfg.set_main_option('script_location', 'alembic')
    alembic_cfg.set_main_option('sqlalchemy.url', toml['SQLALCHEMY_DATABASE_URI'])

    command.upgrade(alembic_cfg, 'head')


@task(db_delete, db_migrate, name='db')
def db_init():
    pass
