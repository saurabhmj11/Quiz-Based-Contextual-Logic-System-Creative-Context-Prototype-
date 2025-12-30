import requests
import time
import concurrent.futures
import random

API_URL = "http://localhost:8000/quiz/next"
NUM_REQUESTS = 100
CONCURRENT_THREADS = 10

def fetch_question(i):
    start_time = time.time()
    try:
        response = requests.post(API_URL, json={
            "user_id": f"stress_tester_{i}", 
            "question_id": "INIT", 
            "answer": "START",
            "time_taken": 0,
            "confidence": 0
        })
        elapsed = time.time() - start_time
        if response.status_code == 200:
            return True, elapsed, response.json().get('next_question', {}).get('id')
        else:
            return False, elapsed, f"Status {response.status_code}"
    except Exception as e:
        return False, time.time() - start_time, str(e)

def run_stress_test():
    print(f"🔥 STARTING STRESS TEST: {NUM_REQUESTS} requests with {CONCURRENT_THREADS} threads...")
    
    success_count = 0
    total_time = 0
    latencies = []
    
    start_global = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_THREADS) as executor:
        futures = [executor.submit(fetch_question, i) for i in range(NUM_REQUESTS)]
        
        for future in concurrent.futures.as_completed(futures):
            success, elapsed, result = future.result()
            latencies.append(elapsed)
            if success:
                success_count += 1
            else:
                print(f"❌ Failed: {result}")

    total_duration = time.time() - start_global
    avg_latency = sum(latencies) / len(latencies)
    
    print("\n" + "="*40)
    print(f"📊 STRESS TEST RESULTS")
    print("="*40)
    print(f"✅ Successful Requests: {success_count}/{NUM_REQUESTS}")
    print(f"⏱️  Total Duration:      {total_duration:.2f}s")
    print(f"⚡ Avg Latency/Req:     {avg_latency*1000:.2f}ms")
    print(f"🚀 Requests/Second:     {NUM_REQUESTS/total_duration:.2f}")
    print("="*40)

if __name__ == "__main__":
    run_stress_test()
