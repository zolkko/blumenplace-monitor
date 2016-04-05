"""create user table

Revision ID: 4c53adb591ef
Revises: 
Create Date: 2016-04-05 18:58:05.330857

"""

# revision identifiers, used by Alembic.
revision = '4c53adb591ef'
down_revision = None
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.Unicode(80), nullable=False, unique=True),
        sa.Column('password', sa.String(40), nullable=False),
        sa.Column('username', sa.Unicode(80), nullable=False)
    )


def downgrade():
    op.drop_table('user')
