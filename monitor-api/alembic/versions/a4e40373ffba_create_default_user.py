"""create default user

Revision ID: a4e40373ffba
Revises: 4c53adb591ef
Create Date: 2016-04-05 19:10:09.150616

"""

# revision identifiers, used by Alembic.
revision = 'a4e40373ffba'
down_revision = '4c53adb591ef'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa

from random import seed as rand_seed
from monitor.models import User


def upgrade():
    rand_seed(1)
    user = sa.sql.table(
        'users',
        sa.sql.column('id'),
        sa.sql.column('email'),
        sa.sql.column('password'),
        sa.sql.column('username'),
        sa.sql.column('roles')
    )
    op.bulk_insert(user, [
        {'id': 1, 'email': 'admin@test', 'password': User.hash_password('admin'), 'username': 'admin', 'roles': ':admin:user:'},
        {'id': 2, 'email': 'user@test', 'password': User.hash_password('user'), 'username': 'user', 'roles': ':user:'}
    ])


def downgrade():
    user = sa.sql.table(
        'user',
        sa.sql.column('id')
    )

    op.execute(
        user.delete().where(user.c.id.in_(1, 2))
    )
