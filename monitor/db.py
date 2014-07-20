# -*- coding: utf-8 -*-

from sqlalchemy import orm


__all__ = (
    'Database',
)


class Session(orm.Session):
    def __init__(self, database, **options):
        """
        Construct a new Session

        :param database: A reference to :class:`.Database`
        """
        super(Session, self).__init__(binds=database.get_binds(), **options)
        self.database = database

    def get_bind(self, mapper=None, clause=None):
        return super(Session, self).get_bind(mapper=mapper, clause=clause)


class SessionFactory(object):
    def __init__(self, database):
        self.database = database

    def __call__(self, **options):
        return Session(self.database, **options)

    def __repr__(self):
        return '<{0} database={1}>'.format(self.__class__.__name__, self.database)


class Database(object):
    def __init__(self, model_class, bind_config):
        self.bind_config = bind_config
        self.model_class = model_class
        self.session = self.create_scoped_session()

    def get_scope_func(self):
        return None

    def create_scoped_session(self):
        return orm.scoped_session(SessionFactory(self), scopefunc=self.get_scope_func())

    def get_binds(self):
        binds = {}
        for bind_key, engine in self.bind_config.items():
            for table in self.get_tables_for_bind(bind_key=bind_key):
                binds[table] = engine
        return binds

    def get_engine(self, bind_key=None):
        return self.bind_config.get(bind_key)

    def get_tables_for_bind(self, bind_key=None):
        return (table for table in self.model_class.metadata.tables.values() if table.info.get('bind_key') == bind_key)

    def execute_for_all_tables(self, operation):
        op = getattr(self.model_class.metadata, operation)
        for bind_key, engine in self.bind_config.items():
            tables = list(self.get_tables_for_bind(bind_key))
            op(bind=engine, tables=tables)

    def create_all(self):
        self.execute_for_all_tables('create_all')

    def drop_all(self):
        self.execute_for_all_tables('drop_all')

    def __repr__(self):
        return '<{0} bind_config={1}>'.format(self.__class__.__name__, self.bind_config)
