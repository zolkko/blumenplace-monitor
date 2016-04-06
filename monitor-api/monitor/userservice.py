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

    def get(self, email, password):
        user = Query(User).filter_by(email=email).first()
        if not user:
            return None
        else:
            if not user.password_valid(password):
                return None
            else:
                return user
