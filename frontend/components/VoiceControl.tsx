'use client';
import { useState, useEffect } from 'react';

export default function VoiceControl({ textToSpeak, onListen }: { textToSpeak: string, onListen?: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = () => {
        if (!('speechSynthesis' in window)) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const listen = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser. Try Chrome.");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        recognition.onstart = () => {
            console.log("Voice recognition started...");
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Heard:", transcript);
            if (onListen) onListen(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Voice recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={speak}
                className={`p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-sm shadow-sm ${isSpeaking
                    ? 'bg-zinc-900 border-zinc-900 text-white animate-pulse'
                    : 'bg-white/50 border-zinc-200/60 text-zinc-500 hover:bg-white hover:border-zinc-300 hover:text-zinc-900 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                title={isSpeaking ? "Stop Reading" : "Read Question Aloud"}
            >
                {isSpeaking ? (
                    <span className="text-sm">⏹️</span>
                ) : (
                    <span className="text-sm opacity-70 group-hover:opacity-100">🔊</span>
                )}
            </button>
            <button
                onClick={listen}
                disabled={isListening}
                className={`p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-sm shadow-sm ${isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-red-500/20'
                    : 'bg-white/50 border-zinc-200/60 text-zinc-500 hover:bg-white hover:border-zinc-300 hover:text-zinc-900 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                title="Answer via Voice"
            >
                {isListening ? (
                    <span className="text-sm animate-ping">●</span>
                ) : (
                    <span className="text-sm opacity-70 group-hover:opacity-100">🎤</span>
                )}
            </button>
        </div>
    );
}
