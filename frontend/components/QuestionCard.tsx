'use client';
import { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

import VoiceControl from './VoiceControl';

export default function QuestionCard() {
  const { currentQuestion, submitAnswer, loading } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0.7);
  const [mounted, setMounted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setMounted(true);
    setStartTime(Date.now());
  }, [currentQuestion]);

  if (!mounted || !currentQuestion) return <div>Loading...</div>;

  const handleSubmit = () => {
    if (selected) {
      const timeTaken = (Date.now() - startTime) / 1000; // Seconds
      submitAnswer(selected, confidence, timeTaken);
      setSelected(null);
    }
  };

  const handleVoiceInput = (text: string) => {
    // Simple fuzzy matching or "Option A/B/C/D" logic
    console.log("Voice Input:", text);
    const lowerText = text.toLowerCase();

    // Check for "Option A", "Option B", etc.
    const optionMap = ['a', 'b', 'c', 'd', 'e'];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      if (lowerText.includes(`option ${optionMap[i]}`) || lowerText.includes(`answer ${optionMap[i]}`)) {
        setSelected(currentQuestion.options[i]);
        return;
      }
    }

    // Check for direct content match
    const match = currentQuestion.options.find(opt =>
      opt.toLowerCase().includes(lowerText) || lowerText.includes(opt.toLowerCase())
    );

    if (match) setSelected(match);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-8 md:p-12 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')] opacity-10" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-dashed border-[#d4cfc0]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] font-bold tracking-widest text-[#8b8682] uppercase font-mono">Topic No. {currentQuestion.id || '01'}</span>
            <span className="text-sm font-bold text-[#2a2a2a] bg-[#e3e0d5] px-3 py-1 rounded-sm shadow-sm">{currentQuestion.topic}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <VoiceControl textToSpeak={currentQuestion.question} onListen={handleVoiceInput} />
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full border border-[#2a2a2a] transition-all duration-300 ${i < currentQuestion.difficulty ? 'bg-[#2a2a2a]' : 'bg-transparent'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-3xl md:text-3xl font-serif font-medium text-[#2a2a2a] mb-10 leading-snug tracking-normal">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-5 mb-10">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full text-left p-4 md:p-5 transition-all duration-200 flex items-center gap-5 group relative
              ${selected === opt
                ? 'ink-border bg-white -translate-y-1 shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]'
                : 'border border-[#d4cfc0] bg-transparent hover:border-[#a8a39d] hover:bg-[#eae8e1]'}`}
          >
            <span className={`flex items-center justify-center w-8 h-8 text-sm font-serif border-2 transition-colors duration-200
                ${selected === opt
                ? 'border-[#2a2a2a] bg-[#2a2a2a] text-[#f4f1ea]'
                : 'border-[#8b8682] text-[#8b8682] group-hover:border-[#2a2a2a] group-hover:text-[#2a2a2a]'}`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="font-serif text-lg text-[#2a2a2a]">{opt}</span>
          </button >
        ))}
      </div>

      {/* Footer / Controls */}
      <div className="flex items-end justify-between gap-10 pt-6 border-t-2 border-dashed border-[#d4cfc0]">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-[#8b8682] uppercase tracking-widest font-mono">Confidence Level</label>
            <span className="text-xs font-mono text-[#2a2a2a]">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="relative h-3 w-full border border-[#8b8682] p-0.5">
            <div
              className="absolute top-0.5 left-0.5 bottom-0.5 bg-[#2a2a2a] transition-all duration-300 ease-out"
              style={{ width: `calc(${confidence * 100}% - 4px)` }}
            />
            <input
              type="range"
              min="0" max="1" step="0.1"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="bg-[#2a2a2a] text-[#f4f1ea] px-8 py-3 font-serif font-bold text-lg tracking-wider hover:bg-[#403c3a] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:translate-y-0.5 border border-transparent"
        >
          {loading ? 'Processing...' : 'CONFIRM'}
        </button>
      </div>
    </div>
  );
}
