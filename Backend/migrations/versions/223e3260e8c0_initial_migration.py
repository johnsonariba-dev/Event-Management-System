"""Update review user to string

Revision ID: bafe967fbb17
Revises: 223e3260e8c0
Create Date: 2025-09-12 13:10:16.634303
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '223e3260e8c0'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema: Change reviews.user_id to a string 'user' column."""
    # Drop the old foreign key first
    op.drop_constraint('reviews_user_id_fkey', 'reviews', type_='foreignkey')
    
    # Alter the column type from INTEGER to VARCHAR
    op.alter_column(
        'reviews',
        'user_id',
        new_column_name='user',
        type_=sa.String(),
        existing_type=sa.INTEGER(),
        existing_nullable=False
    )


def downgrade() -> None:
    """Downgrade schema: Change reviews.user back to user_id integer with FK."""
    # Alter column back to integer
    op.alter_column(
        'reviews',
        'user',
        new_column_name='user_id',
        type_=sa.INTEGER(),
        existing_type=sa.String(),
        existing_nullable=False
    )
    
    # Recreate foreign key to users
    op.create_foreign_key(
        'reviews_user_id_fkey',
        'reviews',
        'users',
        ['user_id'],
        ['id']
    )
