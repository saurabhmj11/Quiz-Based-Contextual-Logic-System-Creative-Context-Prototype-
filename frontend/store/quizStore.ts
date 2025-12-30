import { create } from 'zustand';
import { useAuthStore } from './authStore';

type Question = {
    id: string;
    topic: string;
    difficulty: number;
    question: string;
    options: string[];
    correct: string;
    misconception?: string;
};

type QuizState = {
    currentQuestion: Question | null;
    history: any[];
    learnerState: any;
    mistakes: any[];
    loading: boolean;
    score: number;
    explanation: string | null;
    mnemonicUrl: string | null;
    quizMode: 'practice' | 'exam';

    // Actions
    setQuestion: (q: Question) => void;
    submitAnswer: (answer: string, confidence: number, timeTaken: number) => Promise<void>;
    nextQuestion: () => void;
    toggleMode: () => void;
};

// Mock initial question for demo if API fails
const INITIAL_QUESTION: Question = {
    id: "INIT_001",
    topic: "Welcome",
    difficulty: 1,
    question: "Ready to start your adaptive learning session?",
    options: ["Yes, let's go!", "Wait a moment"],
    correct: "Yes, let's go!",
};

export const useQuizStore = create<QuizState>((set, get) => ({
    currentQuestion: INITIAL_QUESTION,
    history: [],
    mistakes: [],
    learnerState: {
        topics: { "General": 0.5 },
        confidence: 0.8
    },
    loading: false,
    score: 0,
    explanation: null,
    mnemonicUrl: null,
    quizMode: 'practice',

    setQuestion: (q: Question) => set({ currentQuestion: q, explanation: null, mnemonicUrl: null }),

    toggleMode: () => set((state) => ({ quizMode: state.quizMode === 'practice' ? 'exam' : 'practice' })),

    submitAnswer: async (answer: string, confidence: number, timeTaken: number) => {
        set({ loading: true });

        const currentQ = get().currentQuestion;
        const isCorrect = currentQ && answer === currentQ.correct;
        const user = useAuthStore.getState().user;
        const userId = user ? user.id : 0;

        // Neuro-Flow Adaptation Logic
        const state = get();
        let newConfidence = state.learnerState.confidence;

        // Update mistakes if wrong
        let newMistakes = state.mistakes;
        if (!isCorrect && currentQ) {
            const mistakeData = {
                // Correction: AuthStore has user.id as number.
                user_id: user ? user.id : 1,
                question_id: currentQ.id,
                topic: currentQ.topic,
                question_text: currentQ.question,
                user_answer: answer,
                correct_answer: currentQ.correct
            };

            // Optimistic Update
            newMistakes = [...state.mistakes, { ...mistakeData, date: new Date().toISOString() }];

            // Send to Backend (Fire and Forget)
            fetch('http://localhost:8000/quiz/log_mistake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mistakeData)
            }).catch(err => console.error("Failed to log mistake:", err));
        }

        if (isCorrect) {
            // Logic for Correct Answer (unchanged)
            if (timeTaken < 5) newConfidence = Math.min(1.0, newConfidence + 0.1);
            else if (timeTaken < 15) newConfidence = Math.min(1.0, newConfidence + 0.05);
        } else {
            // Logic for Wrong Answer
            if (timeTaken < 3) newConfidence = Math.max(0.1, newConfidence - 0.15);
            if (timeTaken < 3) newConfidence = Math.max(0.1, newConfidence - 0.15);
            else newConfidence = Math.max(0.1, newConfidence - 0.1);
        }

        const currentTopic = currentQ ? currentQ.topic : "General";
        const newTopics = {
            ...state.learnerState.topics,
            [currentTopic]: isCorrect ? Math.min(1, (state.learnerState.topics[currentTopic] || 0.5) + 0.1) : Math.max(0, (state.learnerState.topics[currentTopic] || 0.5) - 0.1)
        };

        // Fetch valid next question or explanation from Backend API
        try {
            const res = await fetch('http://localhost:8000/quiz/next', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    question_id: currentQ ? currentQ.id : "INIT",
                    answer: answer,
                    is_correct: isCorrect,
                    time_taken: timeTaken,
                    confidence: confidence
                })
            });
            const data = await res.json();
            const nextQ = data.next_question;
            const backendState = data.learner_state;
            const backendExplanation = data.explanation;

            // Neuro-Flow: If wrong and explanation exists, show it FIRST (don't advance question yet)
            const isExam = get().quizMode === 'exam';
            if (!isCorrect && !isExam && (backendExplanation || currentQ?.misconception)) {
                const fallbackExplanation = `It seems you have a misconception about ${currentQ?.topic}. ${currentQ?.misconception || ''}.`;

                set({
                    explanation: backendExplanation || fallbackExplanation,
                    loading: false,
                    mnemonicUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
                    learnerState: {
                        confidence: backendState ? backendState.confidence_avg : newConfidence,
                        topics: backendState ? backendState.topic_mastery : newTopics
                    },
                    mistakes: newMistakes
                });
                // Note: We do NOT update currentQuestion here. The user must click "Got it" in ExplanationBox to call nextQuestion().
                return;
            }

            set((state: QuizState) => ({
                loading: false,
                currentQuestion: nextQ,
                score: state.score + (isCorrect ? 10 : 0),
                explanation: null,
                mnemonicUrl: null,
                history: [...state.history, { question: currentQ, answer, isCorrect }],
                mistakes: newMistakes,
                learnerState: {
                    confidence: backendState ? backendState.confidence_avg : newConfidence,
                    topics: backendState ? backendState.topic_mastery : newTopics
                }
            }));

        } catch (e) {
            console.error("Failed to load questions from backend", e);
            set({ loading: false });
        }
    },

    nextQuestion: async () => {
        try {
            const user = useAuthStore.getState().user;
            const userId = user ? user.id : 0;

            // Simple request for next question without state update context
            const res = await fetch('http://localhost:8000/quiz/next', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, question_id: "SKIP", answer: "SKIP", time_taken: 0, confidence: 0 })
            });
            const data = await res.json();
            set({ explanation: null, currentQuestion: data.next_question });
        } catch (e) {
            set({ explanation: null });
        }
    }

}));
