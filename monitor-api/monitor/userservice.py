# -*- coding: utf-8 -*-

from flask import abort
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
        user = User.query.filter_by(email=email).first_or_404()
        if user and user.password_valid(password):
            return user
        else:
            abort(404)
