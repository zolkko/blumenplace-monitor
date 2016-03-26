# -*- coding: utf-8 -*-

import re


SIMPLE_EMAIL_REGEX = re.compile(r'[^\s]+@[^\s]+$')


def email_validator(value):
    if SIMPLE_EMAIL_REGEX.match(value):
        return str(value)
    else:
        raise ValueError('malformed e-mail')
