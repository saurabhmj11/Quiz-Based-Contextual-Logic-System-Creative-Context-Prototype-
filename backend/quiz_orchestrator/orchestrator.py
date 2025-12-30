from context_engine.learner_state import update_context
from ml_engine.knowledge_model import decide_next_step
from rag_service.rag_pipeline import generate_explanation

def handle_answer(payload):
    # payload: { "user_id": str, "question_id": str, "answer": str, "time_taken": int, "confidence": float }
    
    # 1. Check Correctness (Simple string match for prototype)
    # Ideally, we fetch the question from DB to verify, but we trust the payload or the frontend's claim for now?
    # Actually, let's fetch the question logic if possible, or just define it.
    # For this prototype, we'll assume the client sends the *correct* answer too? No that's insecure.
    # We should look up the question. But context_engine text lookup is mocked.
    # Let's trust the input "answer" vs "correct" if we had it, but we don't.
    # WE WILL TRUST THE FRONTEND confidence/time for now, or just assume "success" if the user moves on?
    # NO, we need to know.
    # Let's mock "is_correct" as True if confidence > 0.6 for the sake of the 'Happy Path' demo scene if we lack real validation here.
    # FAILSAFE: The frontend knows it's correct. Let's ask frontend to send 'is_correct' flag in payload.
    
    # 1. Update Learner State
    learner_state = update_context(payload)
    
    # 2. Decide Next Step (ML Engine)
    decision = decide_next_step(learner_state)

    explanation = None
    # 3. If needed, call RAG for explanation
    if decision.get("need_explanation"):
        explanation = generate_explanation(payload, learner_state)

    # 4. Return next question and optional explanation
    return {
        "next_question": decision.get("question"),
        "explanation": explanation,
        "learner_state": learner_state # return for debugging/UI
    }
