'use client';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use timeout only for clearing the preloader, not for animation frames
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2200); // 2.2 seconds total duration

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-[#f4f1ea] flex flex-col items-center justify-center animate-fadeOut pointer-events-none fill-mode-forwards origin-center">
            <style jsx>{`
                @keyframes dash {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes fadeOut {
                    0% { opacity: 1; transform: scale(1); filter: blur(0px); }
                    100% { opacity: 0; transform: scale(1.05); filter: blur(4px); pointer-events: none; }
    }
                .animate-dash {
                    animation: dash 3.5s cubic-bezier(0.45, 0, 0.55, 1) forwards;
                }
                .animate-fadeOut {
                    animation: fadeOut 1.2s cubic-bezier(0.4, 0, 0.2, 1) 2.8s forwards;
                }
            `}</style>

            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]" />

            <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
                {/* EKG Grid Background */}
                <div className="absolute inset-0 border border-[#d4cfc0] bg-[linear-gradient(rgba(212,207,192,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(212,207,192,0.2)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

                {/* EKG Animation */}
                <div className="w-full h-32 relative overflow-hidden mb-6 flex items-center">
                    <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                        <path
                            d="M0,50 L50,50 L60,20 L70,80 L80,50 L120,50 L130,20 L140,80 L150,50 L200,50 L210,10 L220,90 L230,50 L300,50 L310,30 L320,70 L330,50 L400,50 L410,10 L420,90 L430,50 L500,50"
                            fill="none"
                            stroke="#8b0000"
                            strokeWidth="2"
                            className="drop-shadow-sm animate-dash"
                            strokeDasharray="1000"
                            strokeDashoffset="1000"
                        />
                    </svg>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f4f1ea] to-transparent" />
                </div>

                <div className="relative text-center">
                    <h2 className="font-serif font-bold text-2xl text-[#2a2a2a] mb-2 tracking-tight">Initializing Module...</h2>
                    <div className="font-mono text-xs text-[#8b0000] tracking-widest uppercase animate-pulse">
                        System Ready
                    </div>
                </div>
            </div>
        </div>
    );
}
