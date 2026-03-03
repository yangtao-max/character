import React from 'react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { stories } from '../data';
import { ArrowLeft, Zap, Ship, Eye, Compass, ArrowRight, CheckCircle, Lock, MapPin, BookOpen, Sparkles } from 'lucide-react';

interface AdventureMapProps {
  bookId: string;
  onChat: () => void;
  onNav: (screen: string) => void;
}

export default function AdventureMap({ bookId, onChat, onNav }: AdventureMapProps) {
  // Safelist for Tailwind CSS dynamic classes used in this component
  // bg-amber-50 bg-blue-50 bg-emerald-50 bg-purple-50
  // bg-amber-100 bg-blue-100 bg-emerald-100 bg-purple-100
  // bg-amber-200 bg-blue-200 bg-emerald-200 bg-purple-200
  // bg-amber-500 bg-blue-500 bg-emerald-500 bg-purple-500
  // bg-amber-600 bg-blue-600 bg-emerald-600 bg-purple-600
  // border-amber-100 border-blue-100 border-emerald-100 border-purple-100
  // border-amber-200 border-blue-200 border-emerald-200 border-purple-200
  // border-amber-500 border-blue-500 border-emerald-500 border-purple-500
  // text-amber-600 text-blue-600 text-emerald-600 text-purple-600
  // from-amber-50 from-blue-50 from-emerald-50 from-purple-50
  // bg-amber-200/50 bg-blue-200/50 bg-emerald-200/50 bg-purple-200/50
  // hover:bg-amber-600 hover:bg-blue-600 hover:bg-emerald-600 hover:bg-purple-600
  const book = stories.flatMap(s => s.books).find(b => b.id === bookId) || stories[0].books[0];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full flex flex-col bg-${book.theme}-50 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--color-${book.theme}-400) 2px, transparent 2px)`, backgroundSize: '30px 30px' }}></div>
      
      {/* Header */}
      <div className={`flex items-center justify-between p-4 pt-8 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-${book.theme}-100`}>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{book.mapTitle}</h2>
        <button className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-yellow-700 font-bold text-sm">
          {getIconComponent(book.mapIcon, "w-[18px] h-[18px]")}
          航海图
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 flex gap-3 z-20">
        <div className={`flex-1 flex items-center gap-3 rounded-xl border border-${book.theme}-200 bg-${book.theme}-50 p-3 shadow-sm`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${book.theme}-500 text-white`}>
            <Zap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500">航海能量</span>
            <span className="text-xl font-black text-slate-800">150</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
            <Ship size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500">探险等级</span>
            <span className="text-xl font-black text-slate-800">Lv. {book.level}</span>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-y-auto pb-32 px-4 relative z-10">
        <div className={`absolute left-[39px] top-8 bottom-8 w-1.5 bg-${book.theme}-200/50 rounded-full`}></div>
        
        {book.chapters.map((chapter, index) => (
          <div key={index} className={`flex gap-4 mb-8 relative ${chapter.status === 'locked' ? 'opacity-60' : ''}`}>
            <div className="flex flex-col items-center z-10">
              {chapter.status === 'completed' && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border-4 border-amber-500 text-amber-700 shadow-md">
                  {getIconComponent(chapter.icon, "w-6 h-6")}
                </div>
              )}
              {chapter.status === 'active' && (
                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-${book.theme}-500 text-white border-4 border-white shadow-lg animate-bounce`}>
                  {getIconComponent(chapter.icon, "w-[28px] h-[28px]")}
                </div>
              )}
              {chapter.status === 'locked' && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-400 border-4 border-white">
                  {getIconComponent(chapter.icon, "w-6 h-6")}
                </div>
              )}
            </div>
            
            {chapter.status === 'active' ? (
              <div className={`flex-1 bg-gradient-to-r from-${book.theme}-50 to-white p-4 rounded-xl border-2 border-${book.theme}-500 shadow-md relative`}>
                <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Eye size={14} /> 进行中
                </div>
                <h3 className="text-lg font-bold text-slate-800">{chapter.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{chapter.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className={`h-8 w-8 rounded-full bg-${book.theme}-100 text-${book.theme}-600 flex items-center justify-center`}><Compass size={16} /></div>
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Eye size={16} /></div>
                  </div>
                  <button onClick={onChat} className={`bg-${book.theme}-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1 hover:bg-${book.theme}-600`}>
                    进入对话 <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex-1 bg-white p-4 rounded-xl shadow-sm border ${chapter.status === 'locked' ? 'border-slate-200 border-dashed' : `border-${book.theme}-100 relative overflow-hidden`}`}>
                {chapter.status === 'completed' && <div className="absolute right-0 top-0 h-full w-2 bg-amber-400"></div>}
                <h3 className="text-lg font-bold text-slate-800">{chapter.title}</h3>
                <p className={`${chapter.status === 'completed' ? 'text-amber-600' : 'text-slate-500'} text-sm font-medium mt-1 flex items-center gap-1`}>
                  {chapter.status === 'completed' ? <CheckCircle size={16} /> : <Lock size={16} />} {chapter.desc}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav current="map" onNav={onNav} />
    </motion.div>
  );
}
