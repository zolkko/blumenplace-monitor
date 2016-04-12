# -*- coding: utf-8 -*-

import hashlib
import random

from flask_sqlalchemy import SQLAlchemy


__all__ = (
    'db',
    'User'
)


db = SQLAlchemy()


def get_hexdigest(value1, value2):
    return hashlib.sha256(value1 + value2).hexdigest()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Unicode(80), nullable=False, unique=True)
    password = db.Column(db.String(40), nullable=False)
    username = db.Column(db.Unicode(80), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = User.hash_password(password)

    def __repr__(self):
        return '<User %r>' % (self.username, )

    def password_valid(self, password):
        salt, hash_passwd = self.password.split('$', 1)
        return get_hexdigest(salt.encode(), password.encode()) == hash_passwd

    @staticmethod
    def hash_password(password):
        if not password:
            raise ValueError('non empty password expected')

        salt = get_hexdigest(str(random.random()).encode(), str(random.random()).encode())[:5]
        hash_passwd = get_hexdigest(salt.encode(), password.encode())

        return '%s$%s' % (salt, hash_passwd, )
