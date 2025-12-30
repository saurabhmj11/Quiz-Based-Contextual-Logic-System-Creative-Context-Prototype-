'use client';
import { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import ExplanationBox from '../components/ExplanationBox';
import SkillGraph from '../components/SkillGraph';
import AnatomyViewer from '../components/AnatomyViewer';
import MistakeNotebook from '../components/MistakeNotebook';
import Preloader from '../components/Preloader'; // Import Preloader
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { quizMode, mistakes, nextQuestion } = useQuizStore();
  const [showNotebook, setShowNotebook] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-start for prototype demo if not already started
  useEffect(() => {
    if (!hasStarted) {
      nextQuestion();
      setHasStarted(true);
    }
  }, [hasStarted, nextQuestion]);

  return (
    <main className="min-h-screen relative flex flex-col md:flex-row p-6 md:p-12 gap-10 overflow-hidden font-serif">
      <Preloader /> {/* Initialize System */}

      {/* Sketchbook Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#f4f1ea]">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]" />
      </div>

      {/* Mistake Notebook Modal */}
      {showNotebook && <MistakeNotebook onClose={() => setShowNotebook(false)} />}

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 max-w-5xl mx-auto w-full relative">
        <div className="absolute top-0 right-0">
          <button onClick={() => { useAuthStore.getState().logout(); window.location.href = '/login'; }} className="text-xs text-[#8b8682] hover:text-[#2a2a2a] underline font-serif">
            Sign Out
          </button>
        </div>
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b8682] uppercase bg-[#f9f7f1] border border-[#d4cfc0] shadow-sm transform -rotate-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b0000]" />
            Fig 1.0: Adaptive Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2a2a2a] tracking-tighter">
            Anatomy<span className="text-[#8b0000] italic font-serif">Sketchbook</span>
          </h1>
          <p className="text-[#555] text-lg font-serif italic max-w-md mx-auto leading-relaxed border-b border-[#d4cfc0] pb-2 inline-block">
            "Detailed study of the human form & function."
          </p>
        </div>
        <QuestionCard />
      </div>

      {/* Sidebar Stats */}
      <div className="w-full md:w-80 space-y-6 z-10 flex flex-col h-full justify-center">

        {/* Mistake Notebook Trigger */}
        <div
          onClick={() => setShowNotebook(true)}
          className="group cursor-pointer bg-[#8b0000] p-4 rounded-lg shadow-md border-l-4 border-[#500000] relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay" />
          <div className="relative flex justify-between items-center text-[#f4f1ea]">
            <div>
              <h3 className="font-serif font-bold text-lg leading-none">Mistakes</h3>
              <p className="text-[9px] uppercase tracking-widest opacity-80 mt-1">Confidential Record</p>
            </div>
            <div className="bg-[#f4f1ea] text-[#8b0000] font-bold font-mono rounded-full w-8 h-8 flex items-center justify-center shadow-inner pt-0.5">
              {mistakes.length}
            </div>
          </div>
        </div>

        <SkillGraph />
        <AnatomyViewer />

        <div className={`p-6 border-2 border-dashed transition-all duration-500 relative bg-[#f9f7f1] ${quizMode === 'exam'
          ? 'border-[#c96a6a]'
          : 'border-[#d4cfc0]'
          }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4f1ea] px-2 text-[10px] font-bold text-[#8b8682] uppercase tracking-widest">
            Session Mode
          </div>
          <div className="flex items-center justify-between mb-3 mt-1">
            <span className={`w-3 h-3 rounded-full border border-black/20 ${quizMode === 'exam' ? 'bg-[#c96a6a]' : 'bg-[#2a2a2a]'}`} />
            <p className="text-xl font-bold text-[#2a2a2a] font-serif tracking-tight">
              {quizMode === 'exam' ? 'Timed Exam' : 'Study Hall'}
            </p>
          </div>

          <p className="text-xs text-[#555] leading-relaxed font-serif italic text-center">
            {quizMode === 'exam'
              ? "Speed check. No hints available."
              : "Standard review with full annotations."}
          </p>
        </div>
      </div>

      <ExplanationBox />
    </main>
  );
}
