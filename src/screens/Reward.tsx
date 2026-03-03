import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { stories } from '../data';
import { ArrowLeft, Layers, Archive, Verified, Inbox, MessageCircle, CheckCircle, Map, Search, PenTool, BookOpen, Compass, Sparkles, Ship } from 'lucide-react';

interface RewardProps {
  bookId: string;
  onNext: () => void;
  onBackToChat: () => void;
}

export default function Reward({ bookId, onNext, onBackToChat }: RewardProps) {
  // Safelist for Tailwind CSS dynamic classes used in this component
  // bg-amber-600 bg-blue-600 bg-emerald-600 bg-purple-600
  // hover:bg-amber-700 hover:bg-blue-700 hover:bg-emerald-700 hover:bg-purple-700
  // text-amber-600 text-blue-600 text-emerald-600 text-purple-600
  // shadow-amber-300 shadow-blue-300 shadow-emerald-300 shadow-purple-300
  // from-amber-50 from-blue-50 from-emerald-50 from-purple-50
  // to-amber-100 to-blue-100 to-emerald-100 to-purple-100
  // bg-amber-900 bg-blue-900 bg-emerald-900 bg-purple-900
  const book = stories.flatMap(s => s.books).find(b => b.id === bookId) || stories[0].books[0];
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToTreasury = () => {
    setShowAdded(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  // Helper function to map string icons to Lucide components
  const getIconComponent = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'menu_book': return <BookOpen className={className} />;
      case 'explore': return <Compass className={className} />;
      case 'auto_awesome': return <Sparkles className={className} />;
      case 'sailing': return <Ship className={className} />;
      // Add more mappings as needed based on your data.ts
      default: return <BookOpen className={className} />; // Fallback
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full flex flex-col items-center justify-center bg-gradient-to-b from-${book.theme}-50 to-${book.theme}-100 relative overflow-hidden px-6`}
    >
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-200/40 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <button onClick={onBackToChat} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-1">
          <Layers size={18} className="text-yellow-500" /> 12/50
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm">
          <Archive size={20} />
        </button>
      </div>

      {/* Card */}
      <motion.div 
        initial={{ y: 50, rotateY: 90 }}
        animate={{ y: 0, rotateY: 0 }}
        transition={{ type: 'spring', duration: 1.5, bounce: 0.4 }}
        className="relative w-64 h-[340px] z-10 mt-10 mb-8"
      >
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-black italic px-3 py-1 rounded-br-xl z-20 shadow-md">
            SSR
          </div>
          <div className={`h-2/3 bg-${book.theme}-900 relative flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3)_0%,transparent_70%)]"></div>
            {getIconComponent(book.coverIcon, "w-[100px] h-[100px] text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] relative z-10")}
          </div>
          <div className="h-1/3 bg-white flex flex-col items-center justify-center p-4 text-center">
            <h3 className="font-bold text-lg text-slate-800">{book.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{book.author} · 冒险</p>
          </div>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap z-20 flex items-center gap-1">
          <Verified size={14} className="text-yellow-600" />
          <span className="text-xs font-bold text-yellow-800">稀有度：传世名著</span>
        </div>
      </motion.div>

      {/* Text */}
      <div className="text-center z-10 mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">获得</span>新名著卡牌！
        </h1>
        <p className="text-sm text-slate-500 font-medium">恭喜！你已解锁{book.author}的经典之作<br/>快将其收入你的文学宝库吧。</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] z-10 mb-10">
        <StatCard icon={<Map size={20} />} color="indigo" label="情节掌握" value="S级" />
        <StatCard icon={<Search size={20} />} color="rose" label="创作意图" value="100%" />
        <StatCard icon={<PenTool size={20} />} color="emerald" label="词汇积累" value="+35" />
      </div>

      {/* Action */}
      <div className="w-full max-w-[320px] z-10 flex flex-col gap-3">
        <button onClick={handleAddToTreasury} className={`w-full bg-${book.theme}-600 text-white font-bold py-4 rounded-full shadow-lg shadow-${book.theme}-300 flex items-center justify-center gap-2 hover:bg-${book.theme}-700 transition-colors`}>
          <Inbox size={20} /> 收下卡牌，放入宝库
        </button>
        <button onClick={onBackToChat} className={`w-full bg-white text-${book.theme}-600 font-bold py-4 rounded-full shadow-md flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors`}>
          <MessageCircle size={20} /> 返回继续聊天
        </button>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showAdded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle size={48} />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">已收入宝库！</h3>
              <p className="text-sm text-slate-500">卡牌已成功添加至您的收藏</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ icon, color, label, value }: any) {
  const colors: any = {
    indigo: 'text-indigo-500 bg-indigo-50',
    rose: 'text-rose-500 bg-rose-50',
    emerald: 'text-emerald-500 bg-emerald-50'
  };
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-slate-100">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-center">
        <div className="text-[10px] text-slate-400 font-bold">{label}</div>
        <div className="text-sm font-black text-slate-700">{value}</div>
      </div>
    </div>
  );
}
