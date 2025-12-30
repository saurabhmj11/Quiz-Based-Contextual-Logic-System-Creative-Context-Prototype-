'use client';
import { useQuizStore } from '../store/quizStore';
import { useState } from 'react';

export default function MistakeNotebook({ onClose }: { onClose: () => void }) {
    const { mistakes } = useQuizStore();
    const [page, setPage] = useState(0);
    const mistakesPerPage = 3;

    if (!mistakes) return null;

    const totalPages = Math.ceil(mistakes.length / mistakesPerPage);
    const currentMistakes = mistakes.slice(page * mistakesPerPage, (page + 1) * mistakesPerPage);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 h-screen w-screen" onClick={onClose}>
            <div
                className="relative w-full max-w-4xl h-[80vh] bg-[#8b0000] rounded-r-2xl shadow-2xl flex overflow-hidden border-l-[12px] border-[#500000] transform rotate-1 transition-transform"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Book Cover Texture effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                {/* Left Page (Inside Cover) */}
                <div className="w-1/2 h-full bg-[#f4f1ea] border-r border-[#d4cfc0] p-8 md:p-12 relative shadow-inner flex flex-col">
                    <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />

                    <h2 className="text-3xl font-serif font-bold text-[#8b0000] mb-2 tracking-tight">Mistake Log</h2>
                    <p className="text-sm font-serif text-[#555] italic mb-8">"Success is stumbling from failure to failure with no loss of enthusiasm."</p>

                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {mistakes.length === 0 && (
                            <div className="text-center py-20 opacity-50">
                                <span className="text-4xl block mb-2">✨</span>
                                <p className="font-serif">No mistakes yet. Clean sheet!</p>
                            </div>
                        )}
                        {currentMistakes.map((m: any, idx) => (
                            <div key={idx} className="border-b border-dashed border-[#d4cfc0] pb-4 group">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-[10px] font-bold text-[#8b0000] uppercase tracking-widest">{m.topic}</span>
                                    <span className="text-[10px] font-mono text-[#888]">{new Date(m.date).toLocaleDateString()}</span>
                                </div>
                                <p className="font-serif text-[#2a2a2a] font-bold text-md mb-2 leading-tight group-hover:text-[#8b0000] transition-colors">
                                    {m.question}
                                </p>
                                <div className="flex gap-2 text-xs font-mono">
                                    <span className="text-red-600 line-through decoration-red-400">You: {m.userAnswer}</span>
                                    <span className="text-green-700 font-bold">✓ {m.correct}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center text-xs font-serif text-[#888] border-t border-[#d4cfc0] pt-4">
                        <span>CONFIDENTIAL RECORD</span>
                        <span>Page {page + 1} of {totalPages || 1}</span>
                    </div>
                </div>

                {/* Right Page */}
                <div className="w-1/2 h-full bg-[#f9f7f1] p-8 md:p-12 relative shadow-inner flex flex-col justify-center items-center text-center">
                    <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

                    <div className="mb-8">
                        <div className="w-24 h-24 rounded-full border-4 border-[#8b0000] flex items-center justify-center mx-auto mb-4 bg-[#fff] shadow-inner">
                            <span className="text-4xl font-serif font-bold text-[#8b0000]">{mistakes.length}</span>
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2a2a2a]">Total Errors</h3>
                    </div>

                    <div className="space-y-3 w-full max-w-xs">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="w-full py-2 border border-[#8b0000] text-[#8b0000] font-bold font-serif hover:bg-[#8b0000] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8b0000]"
                        >
                            ← Previous Page
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="w-full py-2 bg-[#8b0000] text-white font-bold font-serif hover:bg-[#600000] transition-colors shadow-md disabled:opacity-50"
                        >
                            Next Page →
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-[#555] font-serif hover:text-[#2a2a2a] underline underline-offset-4 decoration-dashed"
                        >
                            Close Notebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
