# -*- coding: utf-8 -*-

from monitor.models import User


class UserService(object):
    def __init__(self, session):
        self.session = session

    @property
    def is_empty(self):
        return not self.session.query(self.session.query(User).exists()).scalar()
