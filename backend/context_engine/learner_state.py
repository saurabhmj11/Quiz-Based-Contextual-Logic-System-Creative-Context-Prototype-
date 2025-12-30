from database.session import SessionLocal
from database.models import LearnerState
import datetime

def update_context(payload):
    """
    Updates the learner's state based on the provided payload (answer, time, confidence).
    Persists data to SQLite using SQLAlchemy.
    """
    try:
        raw_user_id = payload.get("user_id", 0)
        # Ensure ID is Integer
        try:
            user_id = int(raw_user_id)
        except:
            user_id = 0
            
    except Exception:
        user_id = 0

    db = SessionLocal()
    try:
        # Fetch existing state
        state = db.query(LearnerState).filter(LearnerState.user_id == user_id).first()
        
        if not state:
            # Initialize new state
            state = LearnerState(
                user_id=user_id,
                topic_mastery={"General": 0.5},
                confidence_avg=0.5,
                error_pattern=[],
                last_updated=datetime.datetime.utcnow()
            )
            db.add(state)
        
        # Extract Payload Data
        # We need to look up topic from question_id ideally, but for now we trust payload or default
        topic = payload.get("topic", "General") # Use topic from payload if available
        is_correct = payload.get("is_correct", False)
        
        # Cloning existing mastery dict
        current_mastery = dict(state.topic_mastery) if state.topic_mastery else {}
        current_score = current_mastery.get(topic, 0.5)
        
        # Adaptive Logic
        if is_correct:
            # Increase mastery (diminishing returns)
            increment = 0.1 * (1.1 - current_score) 
            current_score = min(1.0, current_score + increment)
        else:
            # Decrease mastery
            decrement = 0.05
            current_score = max(0.1, current_score - decrement)
        
        current_mastery[topic] = current_score
        
        state.topic_mastery = current_mastery
        state.confidence_avg = (state.confidence_avg + payload.get("confidence", 0.5)) / 2
        state.last_updated = datetime.datetime.utcnow()
        
        db.commit()
        db.refresh(state)
        
        return {
            "topic_mastery": state.topic_mastery,
            "confidence_avg": state.confidence_avg
        }

    except Exception as e:
        print(f"Error updating learner state: {e}")
        db.rollback()
        # Return fallback to avoid crashing flow
        return {"topic_mastery": {}, "error": str(e)}
    finally:
        db.close()
