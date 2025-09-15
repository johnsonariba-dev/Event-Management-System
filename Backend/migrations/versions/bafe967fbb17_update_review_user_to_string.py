"""Update review user_id to string

Revision ID: bafe967fbb17
Revises: 223e3260e8c0
Create Date: 2025-09-12 13:10:16.634303
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'bafe967fbb17'
down_revision = '223e3260e8c0'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Upgrade: Change reviews.user_id from Integer to String"""
    with op.batch_alter_table("reviews") as batch_op:
        batch_op.alter_column(
            'user_id',
            existing_type=sa.INTEGER(),
            type_=sa.String(),
            existing_nullable=False
        )

def downgrade() -> None:
    """Downgrade: Change reviews.user_id back to Integer"""
    with op.batch_alter_table("reviews") as batch_op:
        batch_op.alter_column(
            'user_id',
            existing_type=sa.String(),
            type_=sa.INTEGER(),
            existing_nullable=False
        )
