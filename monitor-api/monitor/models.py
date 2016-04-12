# -*- coding: utf-8 -*-

import hashlib
import random

from collections import Iterable

from flask._compat import string_types
from flask_sqlalchemy import SQLAlchemy


__all__ = (
    'db',
    'User'
)


db = SQLAlchemy()


def get_hexdigest(value1, value2):
    return hashlib.sha256(value1 + value2).hexdigest()


class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Unicode(80), nullable=False, unique=True)
    password = db.Column(db.String(40), nullable=False)
    username = db.Column(db.Unicode(80), nullable=False)
    roles = db.Column(db.String(50), nullable=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = User.hash_password(password)

    def __repr__(self):
        return '<User %r>' % (self.username, )

    def password_valid(self, password):
        salt, hash_passwd = self.password.split('$', 1)
        return get_hexdigest(salt.encode(), password.encode()) == hash_passwd

    @property
    def role_list(self):
        if not self.roles:
            return tuple()
        return self.roles.split(':')[1:-1]

    @role_list.setter
    def set_role_list(self, roles):
        if not isinstance(roles, Iterable):
            raise ValueError('roles must be iterable')
        if not roles:
            self.roles = None
        else:
            self.roles = ':%s:' % (':'.join(roles), )

    @staticmethod
    def hash_password(password):
        if not isinstance(password, string_types):
            raise ValueError('password must be a string')

        if not password:
            raise ValueError('non empty password expected')

        salt = get_hexdigest(str(random.random()).encode(), str(random.random()).encode())[:5]
        hash_passwd = get_hexdigest(salt.encode(), password.encode())

        return '%s$%s' % (salt, hash_passwd, )


class Location(db.Model):

    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(100), nullable=False, unique=True)

    lat = db.Column(db.Float(precision=6), nullable=False)
    lng = db.Column(db.Float(precision=6), nullable=False)

    created_at = db.Column(db.TIMESTAMP, nullable=False)
    changed_at = db.Column(db.TIMESTAMP, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
