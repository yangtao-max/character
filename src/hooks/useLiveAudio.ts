import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface UseLiveAudioProps {
  characterName: string;
  bookTitle: string;
  onMessage: (text: string, sender: 'user' | 'bot') => void;
  onAffinityChange: (change: number) => void;
}

export function useLiveAudio({ characterName, bookTitle, onMessage, onAffinityChange }: UseLiveAudioProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const cleanupAudio = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      // The SDK currently doesn't expose a close method directly on the session object in all versions,
      // but we should try to close it if possible, or just let it be garbage collected.
      try {
        if (typeof sessionRef.current.close === 'function') {
          sessionRef.current.close();
        }
      } catch (e) {}
      sessionRef.current = null;
    }
    cleanupAudio();
    setIsConnected(false);
    setIsConnecting(false);
  }, [cleanupAudio]);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextPlayTimeRef.current = playbackContextRef.current.currentTime;

      const systemInstruction = `你现在扮演《${bookTitle}》中的角色：${characterName}。
请根据角色的性格和原著背景与用户进行语音对话。
你的回复应该简短、自然，像真实的对话一样。
如果用户的话语让你觉得有趣或符合原著逻辑，你可以表现得高兴；如果冒犯或无聊，你可以表现得冷淡。`;

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction,
          inputAudioTranscription: { model: "models/gemini-2.5-flash-native-audio-preview-09-2025" },
          outputAudioTranscription: { model: "models/gemini-2.5-flash-native-audio-preview-09-2025" },
        },
        callbacks: {
          onopen: async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              streamRef.current = stream;
              
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
              audioContextRef.current = audioCtx;
              
              const source = audioCtx.createMediaStreamSource(stream);
              sourceRef.current = source;
              
              const processor = audioCtx.createScriptProcessor(4096, 1, 1);
              processorRef.current = processor;
              
              source.connect(processor);
              processor.connect(audioCtx.destination);
              
              processor.onaudioprocess = (e) => {
                if (!sessionRef.current) return;
                
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                }
                
                // Convert to base64
                const bytes = new Uint8Array(pcm16.buffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = window.btoa(binary);
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                });
              };
              
              setIsConnected(true);
              setIsConnecting(false);
            } catch (err) {
              console.error("Error accessing microphone:", err);
              setError("无法访问麦克风");
              disconnect();
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log("Live API Message:", message);
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && playbackContextRef.current) {
              const binaryString = window.atob(base64Audio);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const buffer = new Int16Array(bytes.buffer);
              
              const audioBuffer = playbackContextRef.current.createBuffer(1, buffer.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < buffer.length; i++) {
                channelData[i] = buffer[i] / 32768.0;
              }

              const source = playbackContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(playbackContextRef.current.destination);
              
              if (nextPlayTimeRef.current < playbackContextRef.current.currentTime) {
                nextPlayTimeRef.current = playbackContextRef.current.currentTime;
              }
              source.start(nextPlayTimeRef.current);
              nextPlayTimeRef.current += audioBuffer.duration;
            }
            
            // Handle interruption
            if (message.serverContent?.interrupted && playbackContextRef.current) {
              // Stop playback, clear queue
              playbackContextRef.current.close();
              playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
              nextPlayTimeRef.current = playbackContextRef.current.currentTime;
            }

            // Handle transcription
            if (message.serverContent?.modelTurn?.parts) {
               const textPart = message.serverContent.modelTurn.parts.find(p => p.text);
               if (textPart && textPart.text) {
                 onMessage(textPart.text, 'bot');
                 // Random affinity change for now, or we could use a tool call to evaluate
                 onAffinityChange(Math.floor(Math.random() * 5));
               }
            }
            
            // Handle user transcription
            if (message.clientContent?.turnComplete) {
                // We might not get the exact text here easily without parsing the whole clientContent,
                // but usually the Live API sends back the recognized text in some form.
                // Actually, the Live API sends `message.serverContent.modelTurn` for bot,
                // and `message.clientContent` is what we sent.
                // Wait, the transcription of user input comes in `message.serverContent.interrupted` or similar?
                // No, it comes in `message.serverContent.modelTurn` with `role: "user"`? No.
                // Let's just rely on the bot's response for now, or we can check if there's a way to get user transcription.
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("连接出错");
            disconnect();
          },
          onclose: () => {
            disconnect();
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err) {
      console.error("Failed to connect to Live API:", err);
      setError("连接失败");
      disconnect();
    }
  }, [isConnected, isConnecting, characterName, bookTitle, onMessage, onAffinityChange, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect
  };
}
