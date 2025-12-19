import { useState, useEffect } from 'react';
import { Users, Search, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Header } from './Header';
import { Footer } from './Footer';
import logoImage from '../../assets/Logo_Anonymous.png';

interface LandingPageProps {
  onStartSearch: () => void;
}

export function LandingPage({ onStartSearch }: LandingPageProps) {
  const [onlineUsers, setOnlineUsers] = useState(127);

  // Simulate fluctuating online users
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(100, Math.min(200, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-[70vh]">
        {/* Decorative paw prints */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-20 left-20 text-6xl md:text-9xl">🐾</div>
          <div className="absolute top-40 right-32 text-5xl md:text-7xl">🐾</div>
          <div className="absolute bottom-32 left-1/4 text-6xl md:text-8xl">🐾</div>
          <div className="absolute bottom-20 right-20 text-4xl md:text-6xl">🐾</div>
        </div>

        {/* Main content */}
        <div className="max-w-2xl w-full space-y-6 md:space-y-8 text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white p-0.5 md:p-1 shadow-xl border-4 border-white">
              <img 
                src={logoImage}
                alt="PUP Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-2 md:space-y-3 px-4">
            <h1 className="text-4xl md:text-6xl tracking-tight text-gray-900">
              Untitled
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              PUP Anonymous Chatting Platform
            </p>
          </div>

          {/* Online statistics */}
          <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 w-fit mx-auto shadow-sm border border-orange-100">
            <div className="relative">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm md:text-base text-gray-700">
              <span className="font-semibold text-orange-600">{onlineUsers}</span> users online
            </span>
          </div>

          {/* Search button */}
          <div className="pt-2 md:pt-4 px-4">
            <Button
              onClick={onStartSearch}
              className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-6 md:px-8 py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-base md:text-lg group"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Chatting
              <Heart className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-gray-500 pt-2 md:pt-4 px-4">
            Connect with fellow students anonymously
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}