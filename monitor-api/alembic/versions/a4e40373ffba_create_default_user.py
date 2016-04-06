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
        'user',
        sa.sql.column('id'),
        sa.sql.column('email'),
        sa.sql.column('password'),
        sa.sql.column('username')
    )
    op.bulk_insert(user, [
        {'id': 1, 'email': 'asd@asd', 'password': User.hash_password('asd'), 'username': 'asd'}
    ])


def downgrade():
    user = sa.sql.table(
        'user',
        sa.sql.column('id')
    )

    op.execute(
        user.delete().where(user.c.id == 1)
    )
