import React from 'react';
import { motion } from 'motion/react';
import { X, Diamond, CalendarCheck, Check, Lock, Ship, Compass, Rocket, Hourglass, BookOpen, Medal } from 'lucide-react';

interface DailyCheckInProps {
  onClose: () => void;
}

export default function DailyCheckIn({ onClose }: DailyCheckInProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-blue-50 pt-8 pb-6 px-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 bg-white rounded-full p-1">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-extrabold text-blue-600 mb-1">每日签到</h2>
          <p className="text-slate-500 text-sm font-medium">航海加成补给</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <CheckInDay day={1} icon={<Ship size={24} />} title="2倍航速" color="blue" checked />
            <CheckInDay day={2} icon={<Compass size={24} />} title="+100里程" color="cyan" checked />
            <CheckInDay day={3} icon={<Rocket size={24} />} title="30%加速" color="orange" active />
            <CheckInDay day={4} icon={<Hourglass size={24} />} title="时间停止" color="slate" locked />
            <CheckInDay day={5} icon={<BookOpen size={24} />} title="自动阅读" color="slate" locked />
            <CheckInDay day={6} icon={<Medal size={24} />} title="双倍积分" color="slate" locked />
            <div className="col-span-2 flex flex-col items-center gap-1 opacity-80">
              <div className="w-full aspect-[2/1] rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center">
                <Diamond size={24} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-500">神秘大礼包</span>
              </div>
              <span className="text-xs font-bold text-slate-400">Day 7</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center text-2xl">🦉</div>
            <div>
              <h3 className="font-bold text-blue-800 text-sm">加油猫头鹰</h3>
              <p className="text-[10px] text-slate-600">签到领取加速卡，让你的小树快快长大！</p>
            </div>
          </div>

          <button onClick={onClose} className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <CalendarCheck size={20} /> 立即签到
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CheckInDay({ day, icon, title, color, checked, active, locked }: any) {
  const colors: any = {
    blue: 'text-blue-500 bg-blue-50 border-blue-100',
    cyan: 'text-cyan-500 bg-cyan-50 border-cyan-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]',
    slate: 'text-slate-400 bg-slate-50 border-slate-200'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative w-full aspect-square rounded-full border-2 flex items-center justify-center bg-white ${colors[color]} ${active ? 'scale-110 z-10' : ''}`}>
        {checked && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 z-20">
            <Check size={10} className="text-white font-bold" />
          </div>
        )}
        {locked && (
          <div className="absolute -top-1 -right-1 bg-slate-300 rounded-full p-0.5 z-20">
            <Lock size={10} className="text-white font-bold" />
          </div>
        )}
        <span className={`${active ? 'animate-pulse' : ''}`}>{icon}</span>
      </div>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full truncate max-w-full ${active ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
        {title}
      </span>
      <span className={`text-[10px] font-bold ${active ? 'text-blue-500' : 'text-slate-400'}`}>Day {day}</span>
    </div>
  );
}
