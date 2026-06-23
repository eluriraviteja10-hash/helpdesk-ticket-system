from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.database.db import engine, Base
from app.models.user import User
from app.models.ticket import Ticket
from app.routes.ticket_routes import router as ticket_router
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://helpdesk-ticket-system-beta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ticket_router)
app.include_router(user_router)

@app.get("/")
def home():
    return {"message": "Help Desk Ticket Management System"}

@app.get("/health")
def health_check():
    return {"status": "Application Running"}