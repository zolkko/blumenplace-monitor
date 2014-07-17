# -*- coding: utf-8 -*-
from logging import getLogger


__all__ = ('initialize', )


logger = getLogger(__name__)


class BaseView(object):
    pass


def SignInView(BaseView):
    def get(self):
        return 'hello all'

    def post(self):
        # TODO: redirect to index
        pass


def initialize(app):
    logger.info('Routing initialization.')
    app.add_url_rule('/sign-in', endpoint=None, view_func=SignInView.as_view())
    logger.info('Routing has been initialized.')

