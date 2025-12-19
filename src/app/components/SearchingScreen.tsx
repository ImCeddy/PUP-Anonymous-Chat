import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { Header } from './Header';
import logoImage from '../../assets/Logo_Anonymous.png';

export function SearchingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full space-y-6 md:space-y-8 text-center">
          {/* Animated logo */}
          <div className="flex justify-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white p-1 md:p-2 shadow-xl animate-bounce">
              <img 
                src={logoImage}
                alt="PUP Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Loader className="w-10 h-10 md:w-12 md:h-12 mx-auto text-orange-500 animate-spin" />
            <h2 className="text-xl md:text-2xl text-gray-800">
              Searching for your encounter{dots}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Finding a fellow student to chat with
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}