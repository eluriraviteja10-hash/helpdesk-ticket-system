from pydantic import BaseModel

class TicketCreate(BaseModel):
    title: str
    description: str
    priority: str
    created_by: int

from typing import Literal

class TicketUpdate(BaseModel):
    status: Literal[
        "Open",
        "In Progress",
        "Resolved",
        "Closed"
    ]

class TicketAssign(BaseModel):
    assigned_to: int