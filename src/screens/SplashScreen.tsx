import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { generateGreetingAudio } from '../services/geminiService';
import { playPCM } from '../utils/audio';
import { Sparkles, Play } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'playing'>('loading');
  const [audioData, setAudioData] = useState<string | null>(null);

  useEffect(() => {
    // Generate the greeting audio when the component mounts
    const initAudio = async () => {
      try {
        const data = await generateGreetingAudio("Hi，你终于来了，在这里跟我聊天，你可以有意外的惊喜哦");
        if (data) {
          // data is in format "data:audio/pcm;rate=24000;base64,..."
          const base64 = data.split(',')[1];
          setAudioData(base64);
          setStatus('ready');
        } else {
          // Fallback if generation fails
          setStatus('ready');
        }
      } catch (e) {
        console.error(e);
        setStatus('ready');
      }
    };
    
    initAudio();
  }, []);

  const handlePlay = async () => {
    setStatus('playing');
    if (audioData) {
      try {
        await playPCM(audioData, 24000);
      } catch (e) {
        console.error("Audio playback failed", e);
      }
    } else {
      // Fallback to browser TTS if Gemini failed
      const utterance = new SpeechSynthesisUtterance("Hi，你终于来了，在这里跟我聊天，你可以有意外的惊喜哦");
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
      await new Promise(resolve => {
        utterance.onend = resolve;
      });
    }
    
    // Auto transition after audio finishes
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-indigo-100 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 bg-white/30 rounded-full blur-3xl -top-20 -right-20"
      />
      <motion.div 
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl -bottom-10 -left-10"
      />

      <div className="z-10 flex flex-col items-center">
        {/* Cartoon Character */}
        <motion.div
          animate={status === 'playing' ? {
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0]
          } : {
            y: [0, -5, 0]
          }}
          transition={status === 'playing' ? {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          } : {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative mb-8"
        >
          <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-indigo-100 relative overflow-hidden">
            {/* Simple SVG Cartoon Face */}
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-indigo-500">
              <circle cx="50" cy="50" r="45" fill="#E0E7FF" />
              {/* Eyes */}
              <motion.circle 
                cx="35" cy="40" r="6" fill="#4F46E5"
                animate={status === 'playing' ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2] }}
              />
              <motion.circle 
                cx="65" cy="40" r="6" fill="#4F46E5"
                animate={status === 'playing' ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2] }}
              />
              {/* Cheeks */}
              <circle cx="25" cy="50" r="5" fill="#FDA4AF" opacity="0.6" />
              <circle cx="75" cy="50" r="5" fill="#FDA4AF" opacity="0.6" />
              {/* Mouth */}
              <motion.path 
                d={status === 'playing' ? "M 35 60 Q 50 80 65 60" : "M 40 60 Q 50 70 60 60"} 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="4" 
                strokeLinecap="round"
                animate={status === 'playing' ? {
                  d: [
                    "M 35 60 Q 50 80 65 60",
                    "M 40 60 Q 50 65 60 60",
                    "M 35 60 Q 50 80 65 60"
                  ]
                } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </svg>
          </div>
          
          {/* Sparkles */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 text-amber-400"
          >
            <Sparkles size={32} />
          </motion.div>
        </motion.div>

        {/* Text Bubble */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white px-6 py-4 rounded-2xl shadow-xl relative max-w-[80%] text-center mb-12"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
          <p className="text-lg font-bold text-indigo-900 leading-relaxed">
            "Hi，你终于来了，在这里跟我聊天，你可以有意外的惊喜哦✨"
          </p>
        </motion.div>

        {/* Action Button */}
        {status === 'loading' ? (
          <div className="flex items-center gap-2 text-indigo-500 font-bold">
            <div className="w-5 h-5 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            准备惊喜中...
          </div>
        ) : status === 'ready' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Play fill="currentColor" size={24} />
            开启冒险
          </motion.button>
        ) : (
          <div className="text-indigo-500 font-bold animate-pulse">
            正在播放...
          </div>
        )}
      </div>
    </motion.div>
  );
}
