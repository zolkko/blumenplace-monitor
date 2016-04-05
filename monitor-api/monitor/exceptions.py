# -*- coding: utf-8 -*-

from werkzeug.exceptions import HTTPException


__all__ = (
    'MonitorException',
)


class MonitorException(HTTPException):

    def __init__(self, code, description=None):
        super(MonitorException, self).__init__(description=description)
        self.code = code
