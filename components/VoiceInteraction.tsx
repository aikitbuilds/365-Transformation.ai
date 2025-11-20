import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { LiveSessionManager } from '../services/liveSessionManager';
import { MicIcon, MicOffIcon } from './icons/IconComponents';

interface VoiceInteractionProps {
    onCommand: (command: string) => void;
    isProcessing: boolean;
}

type Status = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR';

export const VoiceInteraction: React.FC<VoiceInteractionProps> = ({ onCommand, isProcessing }) => {
    const [status, setStatus] = useState<Status>('IDLE');
    const [transcript, setTranscript] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sessionManagerRef = useRef<LiveSessionManager | null>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const handleToggleSession = async () => {
        if (status === 'IDLE' || status === 'ERROR') {
            setStatus('CONNECTING');
            setError(null);
            setTranscript(['Connecting to AI...']);

            const manager = new LiveSessionManager({
                onOpen: () => {
                    setStatus('LISTENING');
                    setTranscript(prev => [...prev, 'Connection open. I am listening...']);
                },
                onClose: () => {
                    setStatus('IDLE');
                    setTranscript(prev => [...prev, 'Session closed.']);
                },
                onError: (err) => {
                    setStatus('ERROR');
                    setError(err); // Display the specific error message from the session manager
                    setTranscript(prev => [...prev, `Error: ${err}`]);
                },
                onTranscript: (isFinal, text) => {
                    if (isFinal) {
                        setTranscript(prev => [...prev, `You: ${text}`]);
                        onCommand(text);
                    }
                },
                onModelTranscript: (text) => {
                     setTranscript(prev => [...prev, `AI: ${text}`]);
                },
                onModelSpeaking: (isSpeaking) => {
                     setStatus(isSpeaking ? 'SPEAKING' : 'LISTENING');
                }
            });
            sessionManagerRef.current = manager;
            try {
                await manager.startSession();
            } catch (err: any) {
                setStatus('ERROR');
                setError(err.message);
                setTranscript(prev => [...prev, `Failed to start session: ${err.message}`]);
            }
        } else {
            sessionManagerRef.current?.stopSession();
        }
    };

    const getStatusIndicator = () => {
        switch (status) {
            case 'CONNECTING':
                return <span className="text-yellow-400 animate-pulse">Connecting...</span>;
            case 'LISTENING':
                return <span className="text-green-400 animate-pulse">Listening...</span>;
            case 'SPEAKING':
                return <span className="text-blue-400 animate-pulse">AI Speaking...</span>;
            case 'ERROR':
                return <span className="text-red-400">Error</span>;
            default:
                return <span className="text-slate-400">Idle</span>;
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Voice Command</span>
                    <span className="text-sm font-medium">{getStatusIndicator()}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-24 bg-slate-900 rounded-md p-2 overflow-y-auto text-sm font-mono border border-slate-700 mb-4">
                    {transcript.map((line, i) => <p key={i}>{line}</p>)}
                    <div ref={transcriptEndRef} />
                </div>
                <button
                    onClick={handleToggleSession}
                    disabled={isProcessing || status === 'CONNECTING'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'IDLE' || status === 'ERROR' ? <><MicIcon /> Start Session</> : <><MicOffIcon /> Stop Session</>}
                </button>
                {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
            </CardContent>
        </Card>
    );
};