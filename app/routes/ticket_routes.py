from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.ticket import Ticket
from app.schemas.ticket_schema import (
    TicketCreate,
    TicketUpdate,
    TicketAssign
)
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/tickets")
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority,
        created_by=ticket.created_by
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "message": "Ticket created successfully",
        "ticket_id": new_ticket.id
    }

@router.get("/tickets")
def get_all_tickets(
    db: Session = Depends(get_db)
):
    tickets = db.query(Ticket).all()

    return tickets

@router.get("/tickets/{ticket_id}")
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    return ticket

@router.put("/tickets/{ticket_id}")
def update_ticket_status(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    ticket.status = ticket_update.status

    db.commit()
    db.refresh(ticket)

    return {
        "message": "Ticket updated successfully",
        "ticket_id": ticket.id,
        "status": ticket.status
    }

@router.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    db.delete(ticket)
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }

@router.put("/tickets/{ticket_id}/assign")
def assign_ticket(
    ticket_id: int,
    assignment: TicketAssign,
    current_user_id: int,
    db: Session = Depends(get_db)
):

    current_user = get_current_user(
        current_user_id,
        db
    )

    if not current_user:
        return {
            "message": "User not found"
        }

    if current_user.role != "admin":
        return {
            "message": "Access denied. Admin only."
        }

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    ticket.assigned_to = assignment.assigned_to

    db.commit()
    db.refresh(ticket)

    return {
        "message": "Ticket assigned successfully",
        "ticket_id": ticket.id,
        "assigned_to": ticket.assigned_to
    }

@router.get("/agents/{agent_id}/tickets")
def get_agent_tickets(
    agent_id: int,
    db: Session = Depends(get_db)
):

    tickets = db.query(Ticket).filter(
        Ticket.assigned_to == agent_id
    ).all()

    return tickets

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    total_tickets = db.query(Ticket).count()

    open_tickets = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    resolved_tickets = db.query(Ticket).filter(
        Ticket.status == "Resolved"
    ).count()

    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "resolved_tickets": resolved_tickets
    }