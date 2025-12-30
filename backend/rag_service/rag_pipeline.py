from .prompts import EXPLANATION_PROMPT
from .vector_store import vector_store

def retrieve_relevant_chunks(question_text):
    # Real semantic search
    results = vector_store.search(question_text, k=2)
    
    # Format results for the LLM context window
    context_str = ""
    for i, item in enumerate(results):
        context_str += f"Context {i+1}: [Topic: {item['topic']}] Q: {item['question']} -> Correct Answer: {item['correct']}. Misconception: {item.get('misconception', 'None')}\n"
    
    return context_str

def build_prompt(payload, learner_state, context):
    question = payload.get("question_text", "Unknown Question")
    answer = payload.get("answer", "Unknown Answer")
    error_type = payload.get("error_type", "conceptual") 
    
    return EXPLANATION_PROMPT.format(
        question=question,
        answer=answer,
        error_type=error_type,
        retrieved_chunks=context
    )

def call_llm(prompt):
    # Mock LLM call (simulating "Creative Context")
    # In a real deployment, we'd use:
    # client = OpenAI(api_key=...)
    # response = client.chat.completions.create(model="gpt-4", messages=[...])
    
    return f"**[AI GENERATED EXPLANATION]**\n\nBased on your answer and similar concepts in our knowledge graph:\n\n{prompt.split('Context')[1] if 'Context' in prompt else '...'}\n\nKey Insight: Review the difference between the provided options. The retrieved context suggests a specific pattern in this topic."

def generate_explanation(payload, learner_state):
    question_text = payload.get("question_text", "Example Question")
    
    # 1. Retrieve real context from FAISS
    context = retrieve_relevant_chunks(question_text)
    
    # 2. Build prompt
    prompt = build_prompt(payload, learner_state, context)
    
    # 3. Generate
    explanation = call_llm(prompt)
    
    return explanation
