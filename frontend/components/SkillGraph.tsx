'use client';
import { useQuizStore } from '../store/quizStore';
import { useEffect, useState } from 'react';

export default function SkillGraph() {
    const { learnerState, quizMode, toggleMode } = useQuizStore();
    const topics = learnerState.topics || {};
    const [mounted, setMounted] = useState(false);

    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (quizMode === 'exam') {
            setTimeLeft(180);
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        toggleMode(); // Auto-stop
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizMode, toggleMode]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!mounted) return null;

    return (
        <div className="bg-[#f9f7f1] border-2 border-dashed border-[#d4cfc0] p-6 w-full relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]" />
            <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-[#d4cfc0] pb-4 relative z-10">
                <h3 className="text-[12px] font-bold text-[#8b8682] uppercase tracking-widest font-mono">My Mastery</h3>
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1.5 font-bold tracking-wide text-[10px] uppercase border transition-all ${quizMode === 'exam'
                        ? 'bg-[#c96a6a] text-[#f4f1ea] border-[#c96a6a] shadow-[2px_2px_0px_0px_rgba(201,106,106,0.3)]'
                        : 'bg-[#2a2a2a] text-[#f4f1ea] border-[#2a2a2a] shadow-[2px_2px_0px_0px_rgba(42,42,42,0.3)] hover:translate-y-0.5 hover:shadow-none'
                        }`}
                >
                    {quizMode === 'exam' ? 'Stop Session' : 'Start Exam'}
                </button>
            </div>

            {
                quizMode === 'exam' && (
                    <div className="mb-6 text-center border-b-2 border-dashed border-[#d4cfc0] pb-4">
                        <div className="text-4xl font-mono font-bold text-[#c96a6a] tracking-widest tabular-nums animate-pulse">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-[10px] uppercase font-bold text-[#8b8682] mt-1 tracking-[0.2em]">Time Remaining</p>
                    </div>
                )
            }

            <div className="space-y-4 relative z-10">
                {Object.entries(topics).map(([topic, score]: [string, any]) => (
                    <div key={topic} className="group cursor-default">
                        <div className="flex justify-between text-xs font-serif font-bold mb-2">
                            <span className="text-[#2a2a2a] italic">{topic}</span>
                            <span className="text-[#2a2a2a] font-mono tabular-nums">{(score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-3 w-full border border-[#8b8682] p-0.5 transform -skew-x-6">
                            <div
                                className="h-full bg-[#2a2a2a] transition-all duration-1000 ease-out opacity-80"
                                style={{ width: `${score * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
