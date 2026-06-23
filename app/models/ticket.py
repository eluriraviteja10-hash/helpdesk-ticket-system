from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from datetime import datetime

from app.database.db import Base


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        String(1000),
        nullable=False
    )

    priority = Column(
        String(20),
        nullable=False
    )

    status = Column(
        String(20),
        default="Open"
    )

    created_by = Column(
        Integer,
        nullable=False
    )

    assigned_to = Column(
    Integer,
    nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )