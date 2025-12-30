from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_gateway.routes.quiz import router as quiz_router
from api_gateway.routes.auth import router as auth_router
from database.session import engine
from database.models import Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NeuroAdaptive Quiz Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz_router, prefix="/quiz")
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def health():
    return {"status": "ok"}
