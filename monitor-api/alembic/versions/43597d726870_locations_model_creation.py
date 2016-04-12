"""locations model creation

Revision ID: 43597d726870
Revises: a4e40373ffba
Create Date: 2016-04-12 11:11:18.918352

"""

# revision identifiers, used by Alembic.
revision = '43597d726870'
down_revision = 'a4e40373ffba'
branch_labels = None
depends_on = None


from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'locations',

        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.Unicode(100), nullable=False, unique=True),

        sa.Column('lat', sa.Float(precision=6), nullable=False),
        sa.Column('lng', sa.Float(precision=6), nullable=False),

        sa.Column('created_at', sa.TIMESTAMP, nullable=False),
        sa.Column('changed_at', sa.TIMESTAMP, nullable=False),

        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=True)
    )


def downgrade():
    op.drop_table('locations')
