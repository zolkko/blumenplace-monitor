# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta


__all__ = (
    'Model',
    'User',
)


class BoundDeclarativeMeta(DeclarativeMeta):
    """
    Each model can define particular database where it
    should be stored using ``__bind_key__`` field.
    """

    def __init__(cls, name, bases, class_dict):
        bind_key = class_dict.get('__bind_key__')
        super(BoundDeclarativeMeta, cls).__init__(name, bases, class_dict)
        if bind_key is not None:
            cls.__table__.info['bind_key'] = bind_key


ModelClass = declarative_base(name='ModelClass', metaclass=BoundDeclarativeMeta)


class User(ModelClass):
    __tablename__ = 'users'

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(length=32))
    password = Column(String(length=64))

    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)

    def __repr__(self):
        return "<User(id='{0}', name='{1}')>".format(self.id, self.name)
