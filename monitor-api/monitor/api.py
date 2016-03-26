# -*- coding: utf-8 -*-

from flask_restful import Api


__all__ = ('MonitorApi', )


class MonitorApi(Api):
    def __init__(self, *args, **kwargs):
        super(MonitorApi, self).__init__(*args, **kwargs)
