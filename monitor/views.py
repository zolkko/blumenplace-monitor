# -*- coding: utf-8 -*-

from logging import getLogger

from flask.views import MethodView
from flask.templating import render_template


__all__ = (
    'BaseView',
    'IndexView',
    'SignInView',
    'init',
)


logger = getLogger(__name__)


class BaseView(MethodView):
    pass


class SecureView(MethodView):
    pass


class IndexView(BaseView):
    def get(self):
        return render_template('index', {})


class SignInView(SecureView):
    def get(self):
        return render_template('sign-in', {})


def init(app):
    logger.info('Routing initialization.')
    app.add_url_rule('/', view_func=IndexView.as_view(name='index'))
    app.add_url_rule('/sign-in', view_func=SignInView.as_view(name='sign-in'))
    logger.info('Routing has been initialized.')
