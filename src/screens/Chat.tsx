import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { stories } from '../data';
import { GoogleGenAI, Type } from "@google/genai";
import { ArrowLeft, Info, MoreHorizontal, Heart, Gift, BadgeCheck, Mic, Square, Send, X, Trophy, MessageSquare, Verified, Sparkles } from 'lucide-react';

import { useLiveAudio } from '../hooks/useLiveAudio';

interface ChatProps {
  bookId: string;
  onBack: () => void;
  onReward: () => void;
}

export default function Chat({ bookId, onBack, onReward }: ChatProps) {
  // Safelist for Tailwind CSS dynamic classes used in this component
  // bg-amber-100 bg-blue-100 bg-emerald-100 bg-purple-100
  // bg-amber-500 bg-blue-500 bg-emerald-500 bg-purple-500
  const book = stories.flatMap(s => s.books).find(b => b.id === bookId) || stories[0].books[0];
  const char = book.character;

  const STORAGE_KEY = `chat_${bookId}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) return parsed.messages;
      } catch (e) {}
    }
    return [{ id: 1, sender: 'bot', text: char.greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
  });
  
  const [affinity, setAffinity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.affinity === 'number') return parsed.affinity;
      } catch (e) {}
    }
    return 60;
  });

  const [input, setInput] = useState('');
  const [rewardReady, setRewardReady] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, isConnecting, error, connect, disconnect } = useLiveAudio({
    characterName: char.name,
    bookTitle: book.title,
    onMessage: (text, sender) => {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender, text, time: currentTime }]);
    },
    onAffinityChange: (change) => {
      setAffinity(prev => Math.min(100, Math.max(0, prev + change)));
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, affinity }));
    if (affinity >= 100 && !rewardReady) {
      setRewardReady(true);
    }
  }, [messages, affinity, bookId]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text, time: currentTime }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? '用户' : char.name}: ${msg.text}`).join('\n');

      const prompt = `
你现在扮演《${book.title}》中的角色：${char.name}。

以下是你们之前的对话历史：
${conversationHistory}

用户刚刚对你说：“${text}”

请根据角色的性格和原著背景回复用户。
同时，请评判用户的最新回答或提问是否符合原著逻辑、是否有趣或准确。
如果准确/有趣，好感度增加（1到15之间）；如果不准确/无聊/冒犯，好感度降低（-1到-15之间）；如果一般，好感度不变（0）。

请返回JSON格式：
{
  "reply": "你的回复内容",
  "affinityChange": 10
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              affinityChange: { type: Type.INTEGER }
            },
            required: ["reply", "affinityChange"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      const replyText = result.reply || "（陷入了沉思）";
      const change = result.affinityChange || 0;

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: replyText, time: replyTime }]);
      
      setAffinity(prev => Math.min(100, Math.max(0, prev + change)));
    } catch (error) {
      console.error(error);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "抱歉，我走神了，你能再说一遍吗？", time: replyTime }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const getRelationshipStatus = (aff: number) => {
    if (aff <= 20) return { label: '陌生人', desc: '你们刚刚认识，还需要多交流。' };
    if (aff <= 40) return { label: '泛泛之交', desc: '你们有过几次对话，但还不够深入。' };
    if (aff <= 60) return { label: '朋友', desc: '你们已经建立了一定的信任。' };
    if (aff <= 80) return { label: '知音', desc: '你们非常了解彼此，无话不谈。' };
    return { label: '莫逆之交', desc: '你们的羁绊已经超越了时空的界限。' };
  };

  const relStatus = getRelationshipStatus(affinity);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="h-full flex flex-col bg-slate-50 relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center cursor-pointer" onClick={() => setShowProfile(true)}>
          <h2 className="font-bold text-slate-800 flex items-center justify-center gap-1">
            跨时空对话 <Info size={16} className="text-slate-400" />
          </h2>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> {char.name}在线
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 bg-white flex items-center gap-3 border-b border-slate-100 z-20">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="font-bold text-slate-600">好感度 {affinity}%</span>
            <span className="text-rose-500 font-bold">{relStatus.label}</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => {
              const fillPercentage = Math.max(0, Math.min(100, (affinity - (i - 1) * 20) * 5));
              return (
                <motion.div 
                  key={i} 
                  className="relative w-6 h-6"
                  animate={fillPercentage > 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={fillPercentage > 0 ? { repeat: Infinity, duration: 2, delay: i * 0.2 } : {}}
                >
                  <Heart size={24} className="absolute inset-0 text-rose-100" />
                  <div className="absolute inset-0 overflow-hidden transition-all duration-500" style={{ width: `${fillPercentage}%` }}>
                    <Heart size={24} className="text-rose-500 fill-rose-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {rewardReady && (
          <button onClick={onReward} className="shrink-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm animate-bounce flex items-center gap-1">
            <Gift size={14} /> 领取
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')]">
        
        {/* Profile */}
        <div className="flex flex-col items-center my-4">
          <div 
            className={`w-20 h-20 rounded-full bg-${book.theme}-100 border-4 border-white shadow-md overflow-hidden mb-2 cursor-pointer`}
            onClick={() => setShowProfile(true)}
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${char.avatar}&backgroundColor=b6e3f4`} alt={char.name} className="w-full h-full object-cover" />
          </div>
          <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1 border border-slate-100">
            <BadgeCheck size={14} className="text-yellow-500" /> {char.name} · {char.year}
          </div>
        </div>

        {messages.map((msg) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender === 'user' ? 'user123' : char.avatar}`} alt="avatar" />
            </div>
            <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] text-slate-500 font-medium">{msg.sender === 'user' ? '我' : char.name}</span>
                <span className="text-[9px] text-slate-400">{msg.time}</span>
              </div>
              <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user' ? `bg-${book.theme}-500 text-white rounded-tr-sm` : 'bg-white text-slate-700 rounded-tl-sm shadow-sm border border-slate-100'}`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex gap-2 max-w-[85%] self-start"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${char.avatar}`} alt="avatar" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1 border border-slate-200">
          <button 
            onClick={toggleRecording}
            disabled={isConnecting}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isConnected ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-200'} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isConnecting ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isConnected ? (
              <Square size={20} className="fill-red-500" />
            ) : (
              <Mic size={20} />
            )}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConnected ? "正在聆听..." : "输入你的想法..."} 
            disabled={isConnected || isTyping}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 outline-none disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button onClick={() => handleSend(input)} disabled={isTyping} className={`w-10 h-10 flex items-center justify-center bg-${book.theme}-500 text-white rounded-full shadow-md disabled:opacity-50`}>
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Character Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className={`h-32 bg-${book.theme}-500 relative`}>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center backdrop-blur-md"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-12 mb-4">
                  <div className={`w-24 h-24 rounded-full bg-${book.theme}-100 border-4 border-white shadow-md overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${char.avatar}&backgroundColor=b6e3f4`} alt={char.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 font-bold">好感度</span>
                      <span className="text-lg font-black text-rose-500">{affinity}%</span>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-black text-slate-800">{char.name}</h2>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{char.year}</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">文学巨匠</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">背景故事</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {book.title}的作者。{char.greeting}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">当前关系</h3>
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                        <Heart size={20} className="fill-rose-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{relStatus.label}</div>
                        <div className="text-xs text-slate-500">{relStatus.desc}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">互动成就</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center gap-2 opacity-100">
                        <Trophy size={18} className="text-yellow-500" />
                        <span className="text-xs font-bold text-slate-700">初次相识</span>
                      </div>
                      <div className={`bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center gap-2 ${affinity >= 50 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <MessageSquare size={18} className="text-blue-500" />
                        <span className="text-xs font-bold text-slate-700">深入交流</span>
                      </div>
                      <div className={`bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center gap-2 ${affinity >= 80 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <Verified size={18} className="text-purple-500" />
                        <span className="text-xs font-bold text-slate-700">获得认可</span>
                      </div>
                      <div className={`bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center gap-2 ${affinity >= 100 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <Sparkles size={18} className="text-rose-500" />
                        <span className="text-xs font-bold text-slate-700">结下羁绊</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
