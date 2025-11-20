import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { BrainCircuitIcon, UserCircleIcon } from '../components/icons/IconComponents';

export const LoginPage: React.FC = () => {
    const authContext = useAuth();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <BrainCircuitIcon className="w-16 h-16 mx-auto text-violet-400" />
                    <CardTitle className="mt-4">Transformation OS</CardTitle>
                    <CardDescription>Your Personal Operating System for Growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <button
                        onClick={authContext.signInWithGoogle}
                        className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,36.582,44,30.883,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-700"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-800/50 px-2 text-slate-500">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={authContext.enterDemoMode}
                        className="w-full px-4 py-2 bg-transparent border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <UserCircleIcon className="w-5 h-5" />
                        Enter Demo Mode
                    </button>
                    
                    <p className="text-xs text-center text-slate-500 mt-4">
                        Demo mode uses local storage and does not require an API key.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};