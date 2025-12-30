import csv
import json
import re
import os

INPUT_FILE = r"F:\product\neet\subjects-questions.csv"
OUTPUT_FILE = "datasets/questions.json"

def parse_question_text(text):
    """
    Attempts to separate question text from options (A, B, C, D).
    Returns (question_text, options_list)
    """
    # Regex to find options like A. or (A) or A) or A .
    # We look for A, B, C, D at the start of a line or after a newline
    
    # We will try to find the indices of the options
    # This is a heuristic approach
    
    # Pattern for Option A
    pattern_a = r'(?:^|\n)\s*(?:A\.|A\s\.|A\)|\[A\]|\(A\))\s+'
    match_a = re.search(pattern_a, text, re.IGNORECASE)
    
    if not match_a:
        return text.strip(), []

    start_a = match_a.start()
    question_part = text[:start_a].strip()
    options_part = text[start_a:]
    
    # Now try to split options_part
    # We use a splitting regex
    split_pattern = r'(?:^|\n)\s*(?:[A-D]\.|[A-D]\s\.|[A-D]\)|\[[A-D]\]|\([A-D]\))\s+'
    parts = re.split(split_pattern, options_part, flags=re.IGNORECASE)
    
    # parts[0] should be empty if the string starts with A.
    # parts[1] is A, parts[2] is B, etc.
    
    options = [p.strip() for p in parts if p.strip()]
    
    return question_part, options

def main():
    print(f"Reading from {INPUT_FILE}...")
    
    new_questions = []
    
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.reader(f)
            header = next(reader, None) # Skip header
            
            count = 0
            limit = 50 # For safety in this demo, parse 50. Increase later.
            
            for row in reader:
                if len(row) < 2:
                    continue
                    
                text = row[0]
                subject = row[1]
                
                question_text, options = parse_question_text(text)
                
                # Filter out bad parses
                if len(options) < 4:
                    continue # simplify for now
                
                # Create question object
                q = {
                    "id": f"CSV_{count}",
                    "topic": subject,
                    "difficulty": 3, # Unknown
                    "question": question_text,
                    "options": options[:4], # Ensure max 4
                    "correct": "Unknown", # We don't have the answer key
                    "misconception": None,
                    "error_type": "conceptual",
                    "source": "subjects-questions.csv"
                }
                
                new_questions.append(q)
                count += 1
                if count >= limit:
                    break
                    
        print(f"Parsed {len(new_questions)} questions from CSV.")
        
        # Load existing
        existing = []
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                existing = json.load(f)
        
        # Merge
        combined = existing + new_questions
        
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(combined, f, indent=2)
            
        print(f"Successfully saved {len(combined)} questions to {OUTPUT_FILE}")

    except FileNotFoundError:
        print(f"File not found: {INPUT_FILE}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
