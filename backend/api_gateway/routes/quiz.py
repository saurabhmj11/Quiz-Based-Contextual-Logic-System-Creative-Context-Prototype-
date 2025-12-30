from fastapi import APIRouter
from pydantic import BaseModel
from quiz_orchestrator.orchestrator import handle_answer
import random

router = APIRouter()

class MnemonicRequest(BaseModel):
    topic: str
    fact: str

@router.post("/generate_mnemonic")
async def generate_mnemonic(req: MnemonicRequest):
    # Prompt for DALL-E (Concept)
    prompt = f"A surreal, memorable, cartoon mnemonics image to remember that {req.topic} involves {req.fact}. Use visual puns."
    
    # In a real scenario, we call OpenAI Image API:
    # response = client.images.generate(model="dall-e-3", prompt=prompt)
    # image_url = response.data[0].url
    
    # For prototype demo, return a placeholder image based on topic (using unsplash or similar stable placeholder)
    placeholders = [
        "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800", # Medical-ish
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", # Chemistry
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800", # Biology
        "https://images.unsplash.com/photo-1530026405186-ed1f139a004c?w=800" # DNA
    ]
    
    return {"image_url": random.choice(placeholders), "alt_text": prompt}

@router.post("/next")
def next_question(payload: dict):
    return handle_answer(payload)

class MistakeLog(BaseModel):
    user_id: int = 1 # Default for prototype
    question_id: str
    topic: str
    question_text: str
    user_answer: str
    correct_answer: str

@router.post("/log_mistake")
async def log_mistake(mistake: MistakeLog):
    # In a real app, we'd use a DB session here.
    # For this prototype, we'll just print to console to simulate persistence
    # and maybe append to a local JSON file for persistence demo if needed.
    print(f"PERSISTING MISTAKE: {mistake}")
    return {"status": "saved", "id": random.randint(1000, 9999)}
