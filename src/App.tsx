/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

// Screens
import SplashScreen from './screens/SplashScreen';
import BookSelection from './screens/BookSelection';
import AdventureMap from './screens/AdventureMap';
import Chat from './screens/Chat';
import Reward from './screens/Reward';
import Treasury from './screens/Treasury';
import Reading from './screens/Reading';
import MagicVideo from './screens/MagicVideo';

// Modals
import DailyCheckIn from './components/DailyCheckIn';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('robinson');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setCurrentScreen('splash');
      } else {
        setCurrentScreen('auth');
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after triggering
      setCurrentScreen('splash');
    }
  };

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
    if (screen === 'map') {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckIn = localStorage.getItem('lastCheckInDate');
      if (lastCheckIn !== today) {
        setTimeout(() => setShowCheckIn(true), 500);
      }
    }
  };

  const handleCloseCheckIn = () => {
    setShowCheckIn(false);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastCheckInDate', today);
  };

  if (isCheckingAuth) {
    return <div className="h-[100dvh] w-full max-w-md mx-auto bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative h-[100dvh] w-full max-w-md mx-auto bg-slate-50 overflow-hidden font-display text-slate-800 shadow-2xl">
      <AnimatePresence mode="wait">
        {currentScreen === 'auth' && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-indigo-50 to-white">
            <h1 className="text-2xl font-bold text-indigo-900 mb-4">欢迎来到魔法阅读</h1>
            <p className="text-slate-600 mb-8">为了体验完整的魔法功能（如语音对话、魔法动画），请先配置您的 API Key。</p>
            <button 
              onClick={handleSelectKey}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              配置 API Key
            </button>
            <p className="text-xs text-slate-400 mt-4">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">
                了解如何获取 API Key
              </a>
            </p>
          </div>
        )}
        {currentScreen === 'splash' && <SplashScreen onComplete={() => navigate('book-selection')} />}
        {currentScreen === 'book-selection' && <BookSelection onNext={() => navigate('map')} selectedBookId={selectedBookId} onSelectBook={setSelectedBookId} />}
        {currentScreen === 'map' && <AdventureMap bookId={selectedBookId} onChat={() => navigate('chat')} onNav={(s) => navigate(s)} />}
        {currentScreen === 'chat' && <Chat bookId={selectedBookId} onBack={() => navigate('map')} onReward={() => navigate('reward')} />}
        {currentScreen === 'reward' && <Reward bookId={selectedBookId} onNext={() => navigate('treasury')} onBackToChat={() => navigate('chat')} />}
        {currentScreen === 'treasury' && <Treasury onNav={(s) => navigate(s)} />}
        {currentScreen === 'reading' && <Reading onNav={(s) => navigate(s)} />}
        {currentScreen === 'magic' && <MagicVideo onNav={(s) => navigate(s)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckIn && <DailyCheckIn onClose={handleCloseCheckIn} />}
      </AnimatePresence>
    </div>
  );
}

