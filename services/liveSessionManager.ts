import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from "@google/genai";

// Base64 encoding/decoding functions as required by the guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// FIX: Corrected typo from Uint8A rray to Uint8Array
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface LiveSessionCallbacks {
    onOpen: () => void;
    onClose: () => void;
    onError: (error: string) => void;
    onTranscript: (isFinal: boolean, text: string) => void;
    onModelTranscript: (text: string) => void;
    onModelSpeaking: (isSpeaking: boolean) => void;
}

export class LiveSessionManager {
    private ai: GoogleGenAI;
    private callbacks: LiveSessionCallbacks;
    private sessionPromise: Promise<LiveSession> | null = null;
    
    private inputAudioContext: AudioContext | null = null;
    private outputAudioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private scriptProcessor: ScriptProcessorNode | null = null;
    
    private nextStartTime = 0;
    private audioSources = new Set<AudioBufferSourceNode>();
    // FIX: Use a class property to correctly maintain transcription state across messages.
    private currentInputTranscription = '';

    constructor(callbacks: LiveSessionCallbacks) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        this.callbacks = callbacks;
    }

    async startSession() {
        if (this.sessionPromise) return;

        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error("Error getting user media:", err);
            throw new Error("Microphone access was denied. Please allow microphone access in your browser settings.");
        }

        // FIX: Add `as any` to window to support vendor-prefixed webkitAudioContext without TypeScript errors.
        this.inputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        this.outputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        this.currentInputTranscription = '';

        this.sessionPromise = this.ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
            },
            callbacks: {
                onopen: () => {
                    this.callbacks.onOpen();
                    this.startStreamingAudio();
                },
                onclose: () => {
                    this.callbacks.onClose();
                    this.cleanup();
                },
                onerror: (e: ErrorEvent) => {
                    this.callbacks.onError(e.message);
                    this.cleanup();
                },
                onmessage: async (message: LiveServerMessage) => {
                    this.handleMessage(message);
                }
            }
        });
    }

    private handleMessage(message: LiveServerMessage) {
        if (message.serverContent?.inputTranscription) {
            const { text, isFinal } = message.serverContent.inputTranscription;
            // FIX: Correctly accumulate transcription text from all message parts.
            this.currentInputTranscription += text;
            if (isFinal) {
                this.callbacks.onTranscript(true, this.currentInputTranscription);
                this.currentInputTranscription = ''; // Reset for next utterance
            }
        }

        if(message.serverContent?.outputTranscription) {
            this.callbacks.onModelTranscript(message.serverContent.outputTranscription.text);
        }
        
        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData) {
            this.callbacks.onModelSpeaking(true);
            this.playAudio(audioData).then(() => {
                if (this.audioSources.size === 0) {
                    this.callbacks.onModelSpeaking(false);
                }
            });
        }
    }
    
    private startStreamingAudio() {
        if (!this.inputAudioContext || !this.mediaStream) return;
        
        const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
        this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = this.createBlob(inputData);
            this.sessionPromise?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };
        
        source.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.inputAudioContext.destination);
    }
    
    private createBlob(data: Float32Array): Blob {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    }
    
    private async playAudio(base64Audio: string) {
        if(!this.outputAudioContext) return;

        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
        
        const audioBuffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext, 24000, 1);
        const source = this.outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.outputAudioContext.destination);
        
        return new Promise<void>(resolve => {
            source.addEventListener('ended', () => {
                this.audioSources.delete(source);
                resolve();
            });
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.audioSources.add(source);
        });
    }

    stopSession() {
        this.sessionPromise?.then(session => session.close());
        this.cleanup();
    }
    
    private cleanup() {
        this.scriptProcessor?.disconnect();
        this.scriptProcessor = null;
        this.mediaStream?.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
        this.inputAudioContext?.close().catch(console.error);
        this.inputAudioContext = null;
        
        this.audioSources.forEach(source => source.stop());
        this.audioSources.clear();
        this.outputAudioContext?.close().catch(console.error);
        this.outputAudioContext = null;

        this.sessionPromise = null;
    }
}
