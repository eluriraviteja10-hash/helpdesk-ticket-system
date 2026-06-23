from sqlalchemy.orm import Session
from app.models.user import User

def get_current_user(
    user_id: int,
    db: Session
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    return user