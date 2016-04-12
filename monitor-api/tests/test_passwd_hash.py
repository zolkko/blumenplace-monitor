# -*- coding: utf-8 -*-

import random

import pytest

from monitor.models import User


def test_can_hash_the_password():
    random.seed(1)
    hashed_password = User.hash_password('test')
    assert hashed_password == '02a76$b5ff1a89b65498a217cf172efe0354c1130d412cc69a5d2d09a91f1197c7813b'


def test_password_cannot_be_a_binary_string():
    try:
        User.hash_password(b'test')
        assert False, 'hasing binary string must result in an exception'
    except AttributeError:
        pass


def test_password_cannot_be_an_empty_string():
    try:
        User.hash_password('')
        assert False, 'password cannot be an empty string'
    except ValueError:
        pass
