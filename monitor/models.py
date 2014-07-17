# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.ext.declarative import declarative_base


__all__ = (
    'Model', 'User',
)


Model = declarative_base()


class User(Model):
    __tablename__ = 'users'

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(length=32))
    password = Column(String(length=64))

    def __repr__(self):
        return "<User(id='{0}', name='{1}')>" % (self.id, self.name, )
