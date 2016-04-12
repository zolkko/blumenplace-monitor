# -*- coding: utf-8 -*-

import random

from monitor.models import User


def test_can_hash_the_password():
    random.seed(1)
    hashed_password = User.hash_password('test')
    assert len(hashed_password)


def test_password_cannot_be_a_binary_string():
    try:
        User.hash_password(b'test')
        assert False, 'hasing binary string must result in an exception'
    except ValueError:
        pass


def test_password_cannot_be_an_empty_string():
    try:
        User.hash_password('')
        assert False, 'password cannot be an empty string'
    except ValueError:
        pass
