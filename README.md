# NeuroAdaptive Quiz Engine
## Quiz-Based Contextual Logic System (Creative Context Prototype)

An LLM-powered adaptive learning system that models learner understanding in real time, detects misconceptions, and personalizes both question difficulty and explanations.

## System Design & Capabilities
- **Prompt System Design**: Constructed a functional RAG system where success was driven by complex prompt engineering that balanced factual retrieval with a specific narrative tone.
- **Multimodal Foundation**: Designed the retrieval logic to handle diverse data types, simulating the workflow needed to organize image and video metadata for a creative studio environment.
- **Performance Evaluation**: Developed an evaluation framework to benchmark prompt effectiveness, ensuring the model's "narrative reasoning" was both safe and consistent.

## Features
- **Bayesian Knowledge Tracking**: Models student mastery per topic.
- **Context-aware Reasoning**: Uses LLM + RAG to generate grounded explanations.
- **Real-time Adaptation**: Adjusts difficulty based on confidence and performance.
- **Tutor-like UX**: Focuses on learning, not just testing.

## Tech Stack
- **Backend**: FastAPI, Python (Orchestrator, RAG, ML Engine)
- **Frontend**: Next.js, Tailwind CSS, Zustand
- **AI/ML**: OpenAI/HuggingFace (LLM), FAISS (Vector DB), Custom BKT Logic
- **Database**: PostgreSQL (Production) / SQLite (Dev)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn api_gateway.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm install zustand lucide-react
npm run dev
```

## Architecture
- `backend/quiz_orchestrator`: Main logic brain.
- `backend/rag_service`: Connects to LLM for explanations.
- `backend/context_engine`: Tracks user state.
