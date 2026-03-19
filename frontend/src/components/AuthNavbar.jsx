import { Link } from "react-router";
import { MessageCircleIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

const AuthNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-800/60 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/login" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="size-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <MessageCircleIcon className="w-5 h-5 text-cyan-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">Chatify</h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">About Us</Link>
            <Link to="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">Contact Us</Link>
            <Link to="/faq" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">FAQs</Link>
            
            <div className="flex items-center gap-3 ml-4 border-l border-slate-700 pl-6">
              <Link to="/login" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">Sign In</Link>
              <Link to="/signup" className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-700">About Us</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-700">Contact Us</Link>
            <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-700">FAQs</Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-700">Sign In</Link>
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-slate-700">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;
