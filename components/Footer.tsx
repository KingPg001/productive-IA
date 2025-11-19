import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white tracking-tight">ProductivAI</h3>
            <p className="text-sm text-slate-500 mt-1">
              Gamified Study & Exercise Tracker
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Help Center</a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors group">
              <Github className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors group">
              <Twitter className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} ProductivAI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Gemini API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;