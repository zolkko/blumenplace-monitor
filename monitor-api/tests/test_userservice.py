# -*- coding:utf-8 -*

import unittest

from sqlalchemy import create_engine

from monitor.db import Database
from monitor.models import ModelClass, User
from monitor.userservice import UserService


class UserServiceTestCase(unittest.TestCase):
    def setUp(self):
        engine = create_engine('sqlite:///:memory:', echo=True)
        self.db = Database(ModelClass, bind_config={None: engine})
        self.db.create_all()

    def tearDown(self):
        self.db.drop_all()

    def create_user(self):
        user = User(name='test', password='password')
        self.db.session.add(user)
        self.db.session.commit()
        return user

    def test_detect_no_user(self):
        user_service = UserService(self.db.session)
        self.assertTrue(user_service.is_empty)

    def test_user_exists(self):
        self.create_user()
        user_service = UserService(self.db.session)
        self.assertFalse(user_service.is_empty)
