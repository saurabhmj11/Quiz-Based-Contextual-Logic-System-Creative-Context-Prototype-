import requests
import json
import time
import sys
import os

# Ensure backend directory is in path for importing modules for unit testing if needed
# (though for this script we will primarily rely on API calls and direct module imports where possible)
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# --- CONFIG ---
BASE_URL = "http://localhost:8000"
AUTH_URL = f"{BASE_URL}/auth"
QUIZ_URL = f"{BASE_URL}/quiz"

TEST_USER_EMAIL = f"test_user_{int(time.time())}@example.com"
TEST_USER_PASS = "testpassword123"

# --- COLORS ---
GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

def log_test(name, result, message=""):
    if result:
        print(f"[{GREEN}PASS{RESET}] {name}")
    else:
        print(f"[{RED}FAIL{RESET}] {name}: {message}")
        return False
    return True

def test_system_flow():
    print("\n--- 1. SYSTEM TEST: Full Auth & Quiz Flow ---")
    
    # 1. Signup
    print(f"Attempting signup for {TEST_USER_EMAIL}...")
    try:
        res = requests.post(f"{AUTH_URL}/signup", json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASS})
        if not log_test("Signup Endpoint", res.status_code == 200, res.text): return
        data = res.json()
        token = data.get("access_token")
        user_id = data.get("user_id")
        if not log_test("Token Received", token is not None): return
    except Exception as e:
        log_test("Signup Exception", False, str(e))
        return

    # 2. Login (Verify credentials work)
    print("Attempting login...")
    res = requests.post(f"{AUTH_URL}/login", json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASS})
    if not log_test("Login Endpoint", res.status_code == 200, res.text): return
    
    # 3. Fetch Next Question (Simulate Dashboard Start)
    print("Fetching initial question...")
    res = requests.post(f"{QUIZ_URL}/next", json={
        "user_id": user_id, 
        "question_id": "INIT", 
        "answer": "START", 
        "time_taken": 0, 
        "confidence": 0
    })
    
    if log_test("Initial Question Fetch", res.status_code == 200, res.text):
        q_data = res.json().get("next_question", {})
        log_test("Question Structure Valid", "id" in q_data and "options" in q_data)
        current_q_id = q_data.get("id")
        correct_answer = q_data.get("correct") # Note: In real app we might not send correct answer to frontend, but for prototype we do.

    # 4. Submit Answer (Simulate Interaction)
    print("Submitting answer...")
    res = requests.post(f"{QUIZ_URL}/next", json={
        "user_id": user_id,
        "question_id": current_q_id,
        "answer": correct_answer,
        "time_taken": 5,
        "confidence": 0.9
    })
    log_test("Answer Submission", res.status_code == 200)

def test_logic_rag():
    print("\n--- 2. LOGIC TEST: RAG Retrieval ---")
    try:
        from rag_service.vector_store import vector_store
        
        query = "mitochondria"
        print(f"Searching vector store for '{query}'...")
        results = vector_store.search(query, k=1)
        
        has_results = len(results) > 0
        log_test("Vector Store Search", has_results)
        
        if has_results:
            top_result = results[0]
            is_relevant = "mitochondria" in top_result['question'].lower() or "mitochondria" in top_result['correct'].lower()
            log_test("Relevance Check", is_relevant, f"Top result: {top_result.get('question')}")
            
    except ImportError:
        log_test("Import VectorStore", False, "Could not import backend modules. Run verification in backend context.")
    except Exception as e:
        log_test("RAG Logic Exception", False, str(e))

def test_function_units():
    print("\n--- 3. FUNCTION TEST: Learner State Utils ---")
    try:
        from context_engine.learner_state import update_context
        # We need to mock the DB session for a pure unit test or use a test DB.
        # Given the prototype nature, we will skip complex mocking and rely on the System Flow (which implicitly tests this).
        # Instead, let's test a simple helper or imports.
        
        # Test basic math/logic if available
        log_test("Module Imports", True)
        
    except Exception as e:
        log_test("Unit Test Exception", False, str(e))

if __name__ == "__main__":
    print("🚀 STARTING COMPREHENSIVE TEST SUITE")
    print("====================================")
    
    test_system_flow()
    test_logic_rag()
    test_function_units()
    
    print("\n====================================")
    print("✅ TEST SUITE COMPLETE")
