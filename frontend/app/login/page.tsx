'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        // Note: We need to configure Next.js rewrites or use absolute URL if not proxying.
        // Assuming we might need to point to localhost:8000 directly for now or setup proxy.
        // For this implementation, I will aim for localhost:8000 directly to minimize config friction 
        // but typically we'd use a proxy. 
        const backendUrl = 'http://localhost:8000';
        const url = `${backendUrl}/auth/${isLogin ? 'login' : 'signup'}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Authentication failed');
            }

            login(email, data.access_token, { id: data.user_id, email: data.email });
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#f4f1ea] -z-20"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-md">
                <div className="glass-panel p-8 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/50 shadow-xl ring-1 ring-black/5">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome Back' : 'Join NeetPrep'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {isLogin
                                ? 'Enter your credentials to access your personalized learning path.'
                                : 'Start your journey to medical excellence today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50/50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-medium text-purple-700 hover:text-purple-900 transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer simple */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
