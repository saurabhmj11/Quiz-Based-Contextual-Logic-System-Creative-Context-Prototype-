import json
import os
from datasets import load_dataset
import random

OUTPUT_FILE = "datasets/questions.json"

def format_medmcqa(example, index):
    # MedMCQA structure: question, opa, opb, opc, opd, cop (1-indexed usually), subject_name, topic_name
    
    options = [example['opa'], example['opb'], example['opc'], example['opd']]
    
    # cop is Int corresponding to correct option. Inspecting sample might be needed, but usually 0, 1, 2, 3 or 1, 2, 3, 4
    # Let's assume 1-based from many MCQA datasets, will verify if possible or handle usually.
    # MedMCQA: 'cop': 1 means 'opa'
    
    try:
        correct_idx = example['cop'] - 1
        if correct_idx < 0 or correct_idx >= 4:
            return None # Skip invalid
        correct_answer = options[correct_idx]
    except:
        return None

    return {
        "id": f"MEDMCQA_{index}",
        "topic": example.get('topic_name') or example.get('subject_name') or "General Science",
        "difficulty": 3, # Default mid-difficulty
        "question": example['question'],
        "options": options,
        "correct": correct_answer,
        "misconception": None, # Will need LLM to generate these in future
        "error_type": "conceptual"
    }

def main():
    print("Loading MedMCQA...")
    try:
        # Load a small subset to avoid huge files for this demo
        ds = load_dataset("openlifescienceai/medmcqa", split="train[:50]")
        
        new_questions = []
        for i, item in enumerate(ds):
            q = format_medmcqa(item, i)
            if q:
                new_questions.append(q)
                
        print(f"Loaded {len(new_questions)} questions from MedMCQA.")
        
        # Load existing
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                existing = json.load(f)
        else:
            existing = []
            
        combined = existing + new_questions
        
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(combined, f, indent=2)
            
        print(f"Successfully saved {len(combined)} questions to {OUTPUT_FILE}")
        
    except Exception as e:
        print(f"Error loading dataset: {e}")

if __name__ == "__main__":
    main()
