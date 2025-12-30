import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from database.session import SessionLocal, engine
from database.models import Base, LearnerState, Mistake
from sqlalchemy import text

def reset_demo_state():
    print("🧹 Resetting Demonstration State...")
    
    # Drop and Recreate tables to clear data cleanly
    # (Or just delete rows if we want to keep schema, but drop is cleaner for reset)
    # Actually, let's just delete rows to be safe with locking
    
    db = SessionLocal()
    try:
        # Delete mistakes
        db.query(Mistake).delete()
        print("✅ Cleared Mistakes log.")
        
        # Delete learner state
        db.query(LearnerState).delete()
        print("✅ Cleared Learner mastery state.")
        
        db.commit()
        print("\n✨ Ready for Demo! (You can start at Login screen)")
        
    except Exception as e:
        print(f"❌ Error resetting DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_demo_state()
