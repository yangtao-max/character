import React, { useState } from 'react';
import { motion } from 'motion/react';
import { stories } from '../data';
import { ArrowLeft, Zap, Plus, Settings, Heart, Star, Ship, ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';

interface BookSelectionProps {
  onNext: () => void;
  selectedBookId: string;
  onSelectBook: (id: string) => void;
}

export default function BookSelection({ onNext, selectedBookId, onSelectBook }: BookSelectionProps) {
  // Safelist for Tailwind CSS dynamic classes used in this component
  // bg-amber-500 bg-blue-500 bg-emerald-500 bg-purple-500
  // bg-amber-100 bg-blue-100 bg-emerald-100 bg-purple-100
  // bg-amber-50 bg-blue-50 bg-emerald-50 bg-purple-50
  // text-amber-600 text-blue-600 text-emerald-600 text-purple-600
  // text-amber-400 text-blue-400 text-emerald-400 text-purple-400
  // text-amber-500 text-blue-500 text-emerald-500 text-purple-500
  // text-amber-800 text-blue-800 text-emerald-800 text-purple-800
  // text-amber-800/60 text-blue-800/60 text-emerald-800/60 text-purple-800/60
  // bg-amber-400/20 bg-blue-400/20 bg-emerald-400/20 bg-purple-400/20
  // group-hover:bg-amber-400/30 group-hover:bg-blue-400/30 group-hover:bg-emerald-400/30 group-hover:bg-purple-400/30
  // border-amber-50 border-blue-50 border-emerald-50 border-purple-50
  // border-amber-100 border-blue-100 border-emerald-100 border-purple-100
  // border-amber-300 border-blue-300 border-emerald-300 border-purple-300
  // from-amber-400 from-blue-400 from-emerald-400 from-purple-400
  // to-amber-600 to-blue-600 to-emerald-600 to-purple-600
  // bg-amber-800 bg-blue-800 bg-emerald-800 bg-purple-800
  // group-hover:text-amber-500 group-hover:text-blue-500 group-hover:text-emerald-500 group-hover:text-purple-500
  // group-hover:text-amber-800 group-hover:text-blue-800 group-hover:text-emerald-800 group-hover:text-purple-800
  const [selectedStoryId, setSelectedStoryId] = useState(stories[0].id);
  
  const selectedStory = stories.find(s => s.id === selectedStoryId) || stories[0];
  const selectedBook = selectedStory.books.find(b => b.id === selectedBookId) || selectedStory.books[0];

  // Ensure selected book is in selected story
  if (!selectedStory.books.find(b => b.id === selectedBookId)) {
    onSelectBook(selectedStory.books[0].id);
  }

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col bg-gradient-to-b from-sky-100 to-sky-50 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-40 h-40 bg-white opacity-40 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[-10%] w-60 h-60 bg-sky-200 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0284C7 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 pt-8 z-20">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-sky-600 hover:bg-sky-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-sm border border-sky-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-yellow-300 to-orange-400 text-white shadow-inner">
            <Zap size={16} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">能量值</span>
            <span className="text-sm font-bold text-slate-700">320</span>
          </div>
          <button className="h-6 w-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center ml-2 hover:bg-sky-200 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-sky-600 hover:bg-sky-50 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start relative z-10 w-full px-6 pt-4">
        
        {/* Story Selection */}
        <div className="w-full flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {stories.map(story => (
            <button
              key={story.id}
              onClick={() => setSelectedStoryId(story.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedStoryId === story.id 
                  ? `bg-${story.color}-500 text-white shadow-md` 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {getIconComponent(story.icon, "w-[18px] h-[18px]")}
              <span className="text-sm font-bold">{story.title}</span>
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className={`inline-block px-3 py-1 rounded-full bg-${selectedStory.color}-100 text-${selectedStory.color}-600 text-[10px] font-bold tracking-wider uppercase mb-2`}>
            {selectedStory.subtitle}
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            选择探险故事
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">准备好启程了吗？</p>
        </div>

        {/* 3D Book */}
        <div className="w-full max-w-[260px] aspect-[2/3] relative group cursor-pointer mb-6 perspective-[1000px]">
          <div className={`absolute inset-4 bg-${selectedBook.theme}-400/20 rounded-full blur-2xl group-hover:bg-${selectedBook.theme}-400/30 transition-all duration-500`}></div>
          <motion.div 
            key={selectedBook.id}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: [-5, 5, -5], rotateX: [2, -2, 2], opacity: 1 }}
            transition={{ rotateY: { repeat: Infinity, duration: 6, ease: "easeInOut" }, rotateX: { repeat: Infinity, duration: 6, ease: "easeInOut" }, opacity: { duration: 0.5 } }}
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-white border border-${selectedBook.theme}-50`}>
              <div className={`w-full h-full bg-gradient-to-br from-${selectedBook.theme}-400 to-${selectedBook.theme}-600 relative p-5 flex flex-col justify-between overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  {getIconComponent(selectedBook.coverIcon, "w-[100px] h-[100px] text-white rotate-12")}
                </div>
                <div className="flex justify-between items-start z-10">
                  <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20">经典名著</span>
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
                    <Heart size={14} />
                  </div>
                </div>
                <div className="z-10 mt-auto">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 text-center">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1">{selectedBook.title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{selectedBook.author}</p>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < selectedBook.level ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`absolute left-0 top-2 bottom-2 w-4 bg-${selectedBook.theme}-800 -translate-x-full rounded-l-sm origin-right skew-y-[20deg] opacity-20`}></div>
            <div className="absolute -top-3 -right-3 bg-orange-500 text-white h-12 w-12 rounded-xl flex flex-col items-center justify-center shadow-lg rotate-6 z-20 border-2 border-white">
              <span className="text-[9px] font-bold uppercase leading-none opacity-80">Lv.</span>
              <span className="text-lg font-black leading-none">{selectedBook.level}</span>
            </div>
          </motion.div>
        </div>

        {/* Other Books in Story */}
        <div className="w-full h-28 relative mt-2">
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide justify-center">
            {selectedStory.books.map(book => (
              <div 
                key={book.id}
                onClick={() => onSelectBook(book.id)}
                className={`snap-center shrink-0 w-16 h-24 rounded-lg shadow-sm border relative transition-all cursor-pointer group ${
                  selectedBookId === book.id 
                    ? `bg-${book.theme}-100 border-${book.theme}-300 scale-110 opacity-100 z-10` 
                    : `bg-${book.theme}-50 border-${book.theme}-100 opacity-50 scale-90 hover:scale-100 hover:opacity-100`
                }`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  {getIconComponent(book.coverIcon, `w-6 h-6 text-${book.theme}-400 mb-1 group-hover:text-${book.theme}-500`)}
                  <span className={`text-[9px] font-bold text-center leading-tight text-${book.theme}-800/60 group-hover:text-${book.theme}-800`}>{book.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full px-6 pb-6 pt-2 z-20 bg-gradient-to-t from-sky-50 via-sky-50 to-transparent">
        <button 
          onClick={onNext}
          className="w-full group relative flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 px-6 shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-[4px] transition-all duration-150"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm animate-bounce border-2 border-white">
            RECOMMENDED
          </div>
          <Ship size={24} />
          <div className="flex flex-col items-start">
            <span className="text-lg font-black tracking-tight leading-none">开启航海探险</span>
            <span className="text-[10px] font-bold text-orange-100 uppercase tracking-wide">Start The Adventure</span>
          </div>
          <ArrowRight size={24} className="absolute right-6 opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-slate-400 text-[10px] mt-4 font-medium">
          已有 12,405 位小探险家正在阅读此书
        </p>
      </div>
    </motion.div>
  );
}
