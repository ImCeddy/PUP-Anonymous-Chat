export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-orange-100 px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-500 mt-1">
              Connect with fellow students anonymously and safely
            </p>
          </div>
          <div className="text-center md:text-right text-xs text-gray-500">
            <p className="mt-1">All conversations are anonymous and not stored</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-100 text-center text-xs text-gray-500">
          <p>
            <span className="font-medium">Important:</span> Be respectful and kind. Report any inappropriate behavior.
          </p>
        </div>
      </div>
    </footer>
  );
}
