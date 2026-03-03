import React from 'react';
import { Map, Backpack, BookOpen, Trophy, User, Sparkles } from 'lucide-react';

interface BottomNavProps {
  current: string;
  onNav: (screen: string) => void;
}

export default function BottomNav({ current, onNav }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 pb-6 z-30 flex justify-between items-end shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <NavItem icon={<Map size={24} />} label="地图" active={current === 'map'} onClick={() => onNav('map')} />
      <NavItem icon={<Sparkles size={24} />} label="魔法" active={current === 'magic'} onClick={() => onNav('magic')} />
      <div className="relative -top-6 mx-2">
        <button 
          onClick={() => onNav('book-selection')}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-xl shadow-blue-200 border-[6px] border-white transform hover:scale-105 transition-transform"
        >
          <BookOpen size={32} />
        </button>
        <div className="absolute -bottom-6 w-full text-center">
          <p className="text-[10px] font-black text-sky-600">选书</p>
        </div>
      </div>
      <NavItem icon={<Trophy size={24} />} label="成就" active={current === 'treasury'} onClick={() => onNav('treasury')} />
      <NavItem icon={<User size={24} />} label="我的" active={current === 'profile'} onClick={() => onNav('profile')} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 w-12 group ${active ? 'text-sky-600' : 'text-slate-400 hover:text-sky-600'}`}>
      <div className={`p-1.5 rounded-2xl transition-colors ${active ? 'bg-sky-50' : 'group-hover:bg-sky-50'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
