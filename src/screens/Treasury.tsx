import React from 'react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, Ship, Rocket, Castle, TreePine, PawPrint, Droplets, Lock } from 'lucide-react';

interface TreasuryProps {
  onNav: (screen: string) => void;
}

export default function Treasury({ onNav }: TreasuryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-[#f0f9ff] relative"
    >
      {/* Header */}
      <div className="p-6 pb-2 bg-gradient-to-b from-white/80 to-transparent z-20">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-slate-800">名著宝库</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-600">收集进度</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-500">1</span>
              <span className="text-xs text-slate-400 font-bold">/50</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-[2%]"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2 flex gap-3 overflow-x-auto scrollbar-hide z-20">
        <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap">全部</button>
        <button className="px-4 py-1.5 bg-white text-slate-500 rounded-full text-xs font-bold border border-slate-100 whitespace-nowrap">冒险类</button>
        <button className="px-4 py-1.5 bg-white text-slate-500 rounded-full text-xs font-bold border border-slate-100 whitespace-nowrap">科普类</button>
        <button className="px-4 py-1.5 bg-white text-slate-500 rounded-full text-xs font-bold border border-slate-100 whitespace-nowrap">历史类</button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 z-10 grid grid-cols-2 gap-4 content-start">
        {/* Unlocked Card */}
        <div className="bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(255,210,0,0.3)] border-2 border-yellow-300 relative">
          <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-br-lg z-10">SSR</div>
          <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-3 relative overflow-hidden">
            <Ship size={64} className="text-yellow-500" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-sm mb-0.5">鲁滨逊漂流记</h3>
            <p className="text-[10px] text-yellow-600 font-bold bg-yellow-50 inline-block px-2 py-0.5 rounded-full">丹尼尔·笛福</p>
          </div>
        </div>

        {/* Locked Cards */}
        <LockedCard title="小王子" author="圣埃克苏佩里" icon={<Rocket size={50} className="text-slate-300" />} />
        <LockedCard title="哈利·波特" author="J.K.罗琳" icon={<Castle size={50} className="text-slate-300" />} />
        <LockedCard title="森林报" author="比安基" icon={<TreePine size={50} className="text-slate-300" />} />
        <LockedCard title="夏洛的网" author="E.B.怀特" icon={<PawPrint size={50} className="text-slate-300" />} />
        <LockedCard title="海底两万里" author="儒勒·凡尔纳" icon={<Droplets size={50} className="text-slate-300" />} />
      </div>

      <BottomNav current="treasury" onNav={onNav} />
    </motion.div>
  );
}

function LockedCard({ title, author, icon }: any) {
  return (
    <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-slate-100 relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-slate-200/80 backdrop-blur-sm flex items-center justify-center">
          <Lock size={20} className="text-slate-400" />
        </div>
      </div>
      <div className="aspect-[3/4] rounded-xl bg-slate-100 flex items-center justify-center mb-3 opacity-40 grayscale">
        {icon}
      </div>
      <div className="text-center opacity-40">
        <h3 className="font-bold text-slate-800 text-sm mb-0.5">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold bg-slate-50 inline-block px-2 py-0.5 rounded-full">{author}</p>
      </div>
    </div>
  );
}
