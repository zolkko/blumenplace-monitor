# -*- coding: utf-8 -*-

import re


__all__ = (
    'email_validator',
)


SIMPLE_EMAIL_REGEX = re.compile(r'.+@.+$')


def email_validator(value):
    if SIMPLE_EMAIL_REGEX.match(value):
        return str(value)
    else:
        raise ValueError('malformed e-mail')
