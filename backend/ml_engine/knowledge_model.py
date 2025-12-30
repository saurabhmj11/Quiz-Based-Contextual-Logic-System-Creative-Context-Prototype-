import random
import json
import os

def decide_next_step(learner_state):
    """
    Decides the next question or action based on learner state.
    """
    # Simple logic for prototype:
    # If mastery is low, give easier question.
    # If mastery is high, give harder question.
    # If error pattern suggests misconception, flag need_explanation.
    
    # Mock decision
    need_explanation = False
    
    # Load questions from the expanded dataset
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_path = os.path.join(current_dir, "..", "datasets", "questions.json")
        
        with open(dataset_path, 'r', encoding='utf-8') as f:
            question_bank = json.load(f)
            
    except Exception as e:
        print(f"Error loading questions DB: {e}. Falling back to emergency bank.")
        question_bank = [
            {
                "id": "FALLBACK_001", 
                "question": "What is the powerhouse of the cell?", 
                "options": ["Mitochondria", "Nucleus", "Ribosome", "Golgi"], 
                "correct": "Mitochondria", 
                "topic": "Cell Biology", 
                 "difficulty": 1
            }
        ]
    
    # Adaptive Logic Simulation:
    # 1. Filter by Difficulty based on Learner Confidence (Mock)
    # 2. Filter by Topic if specified (Mock)
    
    # For now, purely random selection from the 1500+ bank
    next_question = random.choice(question_bank)
    
    # Randomly trigger explanation for demo purposes
    if random.random() < 0.2:
        need_explanation = True

    return {
        "question": next_question,
        "need_explanation": need_explanation
    }
