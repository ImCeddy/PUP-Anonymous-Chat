import logoImage from '../../assets/Logo_Anonymous.png';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-4 md:px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
              src={logoImage} 
              alt="PUP Logo" 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full"
            />
          <div>
            <h1 className="font-semibold text-gray-800 text-sm md:text-base">Untitled</h1>
            <p className="text-xs text-gray-500 hidden sm:block">PUP Anonymous Platform</p>
          </div>
        </div>
      </div>
    </header>
  );
}