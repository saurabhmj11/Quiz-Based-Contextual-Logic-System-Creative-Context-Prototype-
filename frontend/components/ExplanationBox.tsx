'use client';
import { useQuizStore } from '../store/quizStore';

export default function ExplanationBox() {
    const { explanation, mnemonicUrl, nextQuestion } = useQuizStore();

    if (!explanation) return null;

    return (
        <div className="fixed bottom-8 right-8 max-w-md bg-[#fef9c3] p-6 w-full animate-in slide-in-from-bottom-10 fade-in duration-500 z-50 transform rotate-1 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] border border-[#fde047]">
            <div className="absolute -top-3 -left-3 bg-[#eab308] text-white w-8 h-8 flex items-center justify-center shadow-sm text-lg transform -rotate-6 clip-path-pin">
                📌
            </div>
            <div className="space-y-4">
                <div>
                    <span className="text-[10px] font-bold text-[#854d0e] uppercase tracking-widest block mb-1 font-mono">Note to Self</span>
                    <h3 className="font-serif font-bold text-[#422006] text-xl italic tracking-tight underline decoration-wavy decoration-[#eab308]/30">Let's clarify that...</h3>
                </div>

                <p className="text-[#713f12] text-sm leading-relaxed font-serif font-medium">{explanation}</p>

                {mnemonicUrl && (
                    <div className="group relative bg-white p-3 shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-gray-200">
                        <img src={mnemonicUrl!} alt="Visual Mnemonic" className="w-full h-40 object-cover grayscale-[0.2] contrast-125" />
                        <div className="pt-2 text-center">
                            <p className="text-[10px] font-bold tracking-wider text-[#78716c] uppercase font-mono">Fig. Memory Aid</p>
                        </div>
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={nextQuestion}
                        className="text-[#fefce8] bg-[#854d0e] hover:bg-[#713f12] px-6 py-2 font-serif font-bold text-sm tracking-wide shadow-sm hover:shadow-md active:scale-95 border-b-2 border-[#422006]"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
}
