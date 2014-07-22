# -*- coding: utf-8 -*-

from sqlalchemy.orm import Query

from monitor.models import User


class UserService(object):

    __is_empty_expression = Query(User).exists()

    def __init__(self, session):
        self.session = session

    @property
    def is_empty(self):
        return not self.session.query(self.__is_empty_expression).scalar()
