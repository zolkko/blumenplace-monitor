# -*- coding: utf-8 -*-

from flask.views import MethodViewType, with_metaclass
from flask_restful import Resource

from monitor.tokens import token_required


__all__ = (
    'AutoOptionsMethodViewType',
    'BaseResource',
    'ProtectedResource',
)


class AutoOptionsMethodViewType(MethodViewType):

    def __new__(mcs, name, bases, d):
        methods = d.get('methods')
        if methods:
            methods = set(methods)
            methods.add('OPTIONS')
            d['methods'] = sorted(methods)

        if methods and 'options' not in d:
            """In normal situation an implementation of this methods
            will never be called, because of crossdomain() decorator attached
            to MonitorApi class"""
            d['options'] = lambda self, *args, **kwargs: None

        return MethodViewType.__new__(mcs, name, bases, d)


class BaseResource(with_metaclass(AutoOptionsMethodViewType, Resource)):

    pass


class ProtectedResource(BaseResource):

    decorators = (token_required,)
