# -*- coding:utf-8 -*

import pytest

from sqlalchemy import create_engine

from werkzeug.exceptions import NotFound

from monitor import create_app
from monitor.models import db, User
from monitor.userservice import UserService


@pytest.fixture()
def app(request):
    rv = create_app('blumenplace-monitor-tests', dict_config={
        'LOGGER_NAME': 'app',
        'staticFolder': '/app/static',
        'staticUrl': '/static',
        'templateFolder': 'templates',
        'jwt': {
            'pub': '/etc/bpmon/ca/bpmon.pub',
            'prv': '/etc/bpmon/ca/bpmon.prv',
            'alg': 'RS256',
            'leeway': 10,
            'exp': 300,
            'nbf': 0,
            'header': 'X-Access-Token',
            'verify_claims': ['signature', 'exp', 'nbf'],
            'required_claims': ['exp', 'nbf']
        }
    })

    app_test_request_context = rv.test_request_context()
    app_test_request_context.__enter__()

    db_engine = create_engine('sqlite:///:memory:', echo=True)
    db.get_engine = lambda *args, **kwargs: db_engine
    db.init_app(rv)
    db.create_all(bind=None)

    # def teardown_db_tables():
    #     db.delete_all()
    # request.addfinalizer(teardown_db_tables)

    def teardown_test_request_context():
        db.drop_all()
        app_test_request_context.__exit__(None, None, None)
    request.addfinalizer(teardown_test_request_context)

    return rv


def test_user_service_is_empty(app):
    service = UserService(db.session)
    db_is_empty = service.is_empty
    assert db_is_empty, 'If there is not users in the databases it is considered empty'


def test_user_service_is_not_empty(app):
    """
    If there is at least one user in the database, it is no longer considered emtpy
    """
    current_db = app.extensions['sqlalchemy'].db

    user = User('test', 'test@example.com', 'test')
    current_db.session.add(user)
    current_db.session.commit()

    service = UserService(current_db.session)
    db_is_not_empty = not service.is_empty
    assert db_is_not_empty


def test_user_not_found_becase_email_if_wrong(app):
    current_db = app.extensions['sqlalchemy'].db

    current_db.session.add(User('test', 'test@example.com', 'test'))
    current_db.session.commit()

    service = UserService(current_db.session)
    try:
        service.get('test2@email.com', 'test')
        assert False
    except NotFound:
        pass


def test_user_not_found_because_password_is_wrong(app):
    current_db = app.extensions['sqlalchemy'].db

    current_db.session.add(User('test', 'test@example.com', 'test'))
    current_db.session.commit()

    user_service = UserService(current_db.session)
    try:
        user = user_service.get('test@email.com', 'wrong-password')
        assert False
    except NotFound:
        pass


def test_user_can_find_the_user_if_email_and_password_correct(app):
    current_db = app.extensions['sqlalchemy'].db

    current_db.session.add(User('test', 'test@example.com', 'test'))
    current_db.session.commit()

    user_service = UserService(current_db)
    user = user_service.get('test@example.com', 'test')

    assert user.username == 'test'
