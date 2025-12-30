import json
import os
import argparse
from openai import OpenAI

# Setup
INPUT_FILE = "datasets/questions.json"
OUTPUT_FILE = "datasets/questions.json"

SOLVER_SYSTEM_PROMPT = """
You are an expert academic tutor for NEET (Medical Entrance). 
Your task is to solve the multiple-choice question provided.

Output Format (JSON only):
{
  "correct_option_text": "The exact text of the correct option",
  "misconception": "A brief explanation of why the common wrong answer is chosen (max 1 sentence)",
  "difficulty": 1-5 (integer),
  "error_type": "conceptual" | "calculation" | "fact_recall"
}

Ensure 'correct_option_text' matches one of the provided options EXACTLY.
"""

def solve_question(client, q):
    try:
        prompt = f"""
        Question: {q['question']}
        Options: {json.dumps(q['options'])}
        """
        
        response = client.chat.completions.create(
            model="gpt-4o", # or gpt-3.5-turbo
            messages=[
                {"role": "system", "content": SOLVER_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error solving question {q.get('id')}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api_key", help="OpenAI API Key")
    parser.add_argument("--mock", action="store_true", help="Use mock data instead of API")
    args = parser.parse_args()

    # Load Data
    if not os.path.exists(INPUT_FILE):
        print(f"File {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, 'r') as f:
        questions = json.load(f)

    # Initialize Client
    client = None
    if not args.mock:
        api_key = args.api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Error: No API Key provided. Set OPENAI_API_KEY or use --api_key or --mock.")
            return
        client = OpenAI(api_key=api_key)

    solved_count = 0
    
    print(f"Scanning {len(questions)} questions...")

    for q in questions:
        if q.get("correct") == "Unknown":
            print(f"Solving {q['id']}...")
            
            if args.mock:
                # Mock Solver
                q["correct"] = q["options"][0] if q["options"] else "Unknown"
                q["misconception"] = "Mock misconception description."
                q["difficulty"] = 3
                solved_count += 1
            else:
                # LLM Solver
                result = solve_question(client, q)
                if result:
                    q["correct"] = result.get("correct_option_text", q["options"][0])
                    q["misconception"] = result.get("misconception")
                    q["difficulty"] = result.get("difficulty", 3)
                    q["error_type"] = result.get("error_type", "conceptual")
                    solved_count += 1
                    
    # Save
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(questions, f, indent=2)

    print(f"Solved and updated {solved_count} questions.")

if __name__ == "__main__":
    main()
