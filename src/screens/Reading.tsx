import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, Edit2, Star, Zap, Bell, Droplets, Sun, Sprout, Flower2, Mic, ChevronRight, Plus, X, BarChart2 } from 'lucide-react';

interface ReadingProps {
  onNav: (screen: string) => void;
}

export default function Reading({ onNav }: ReadingProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(30); // minutes
  const [currentProgress, setCurrentProgress] = useState(12); // minutes

  const progressPercent = Math.min(100, Math.round((currentProgress / dailyGoal) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-slate-50 relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8 bg-white z-20">
        <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">智慧灌溉</h2>
        <button className="px-3 py-1.5 border border-blue-200 text-blue-500 rounded-full text-sm font-bold">
          规则
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Daily Goal Tracker */}
        <div className="m-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-blue-100 mb-1">今日阅读目标</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">{currentProgress}</span>
                <span className="text-sm text-blue-200">/ {dailyGoal} 分钟</span>
              </div>
            </div>
            <button 
              onClick={() => setShowGoalModal(true)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between text-[10px] font-bold text-blue-200 mb-1.5">
              <span>进度 {progressPercent}%</span>
              {progressPercent >= 100 && <span className="text-yellow-300 flex items-center gap-0.5"><Star size={12} className="fill-yellow-300" /> 目标达成</span>}
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Energy */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">当前能量</div>
              <div className="text-sm font-black text-slate-800">2,850 / 3,000</div>
            </div>
          </div>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[90%] h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Tree Area */}
        <div className="mx-4 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md text-xs font-bold text-slate-700 flex items-center gap-1 z-10 border border-slate-100 whitespace-nowrap">
            <Bell size={14} className="text-blue-500" /> 智慧树需要浇水啦！
          </div>
          
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative aspect-square shadow-lg">
            <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800&h=800" alt="Tree" className="w-full h-full object-cover opacity-80" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 bg-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg">
              <Droplets size={20} className="text-blue-500" />
              <span className="text-[10px] text-blue-600 font-bold">+10ml</span>
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg">
              <Sun size={20} className="text-yellow-500" />
              <span className="text-[10px] text-yellow-600 font-bold">光照充足</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-[-20px] relative z-10 px-4">
            <ActionBtn icon={<Sprout size={24} />} label="播种" sub="0/3" color="emerald" />
            <ActionBtn icon={<Droplets size={24} />} label="浇水" sub="850ml" color="blue" active />
            <ActionBtn icon={<Flower2 size={24} />} label="收获" sub="待成熟" color="yellow" />
          </div>
        </div>

        {/* Reading Section */}
        <div className="mt-8 mx-4">
          <div className="flex justify-center mb-4">
            <div className="bg-white px-4 py-1.5 rounded-full shadow-sm text-blue-500 text-sm font-bold flex items-center gap-2 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Reading... +50 words
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between mb-8 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setCurrentProgress(prev => Math.min(dailyGoal, prev + 5))}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                <Mic size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Start Reading</h3>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-3 bg-blue-300 rounded-full"></div>
                  <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
                  <div className="w-1 h-2 bg-blue-200 rounded-full"></div>
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <ChevronRight size={24} className="text-slate-300" />
          </div>

          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800">正在阅读</h3>
            <button className="text-sm text-blue-500 font-bold flex items-center">全部 <ChevronRight size={16} /></button>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            <BookItem title="小王子" cover="bg-teal-700" badge="+150ml" />
            <BookItem title="正在阅读" cover="bg-emerald-400" active />
            <div className="w-32 shrink-0 flex flex-col items-center gap-2">
              <div className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-white text-slate-400">
                <Plus size={32} className="mb-1" />
                <span className="text-xs font-medium">添加书籍</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav current="reading" onNav={onNav} />

      {/* Goal Setting Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">设置阅读目标</h3>
                <button onClick={() => setShowGoalModal(false)} className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                <div className="text-5xl font-black text-blue-500 mb-2">{dailyGoal}</div>
                <div className="text-sm text-slate-500 font-bold">分钟 / 天</div>
              </div>
              
              <div className="flex justify-between gap-3 mb-6">
                {[15, 30, 45, 60].map(val => (
                  <button 
                    key={val}
                    onClick={() => setDailyGoal(val)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${dailyGoal === val ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {val}m
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowGoalModal(false)}
                className="w-full bg-slate-800 text-white font-bold py-4 rounded-full shadow-lg"
              >
                保存设置
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionBtn({ icon, label, sub, color, active }: any) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-50',
    blue: 'text-blue-500 bg-blue-50',
    yellow: 'text-yellow-500 bg-yellow-50'
  };
  return (
    <div className={`bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm border border-slate-100 min-w-[90px] ${active ? 'scale-110 shadow-md z-10' : ''}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <span className={`text-[10px] ${active ? 'text-blue-500' : 'text-slate-400'}`}>{sub}</span>
    </div>
  );
}

function BookItem({ title, cover, badge, active }: any) {
  return (
    <div className="w-32 shrink-0 flex flex-col items-center gap-2">
      <div className={`w-full aspect-[3/4] rounded-2xl relative overflow-hidden shadow-md ${cover} ${active ? 'border-4 border-blue-500' : ''}`}>
        {badge && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {badge}
          </div>
        )}
        {active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <BarChart2 size={32} className="text-white" />
          </div>
        )}
      </div>
      <span className={`text-sm font-bold ${active ? 'text-blue-500' : 'text-slate-800'}`}>{title}</span>
    </div>
  );
}
