import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, title }) => {
  const glassStyles = isDarkMode
    ? 'bg-white/5 border-b border-white/10 text-white'
    : 'bg-white/40 border-b border-white/20 text-gray-900';

  const inputStyles = isDarkMode
    ? 'bg-white/10 text-white placeholder-white/50 focus:bg-white/20'
    : 'bg-black/5 text-gray-900 placeholder-gray-500 focus:bg-black/10';

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-2xl saturate-150 transition-colors duration-500 ${glassStyles}`}>
      <div className="flex items-center gap-4 md:ml-2">
        <h1 className="text-2xl font-semibold tracking-tight hidden md:block">{title}</h1>
        {/* Mobile Title */}
        <h1 className="text-xl font-semibold tracking-tight md:hidden">Docs</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Search Bar */}
        <div className="relative group w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search documents..."
            className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm outline-none transition-all duration-300 ${inputStyles}`}
          />
        </div>

        {/* Search Icon Mobile */}
        <button className={`sm:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}>
             <Search size={20} />
        </button>

        {/* Notifications */}
        <button className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative`}>
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-transparent"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
          aria-label="Toggle Theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </motion.div>
        </button>
        
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 border-2 border-white/20 shadow-sm cursor-pointer" />
      </div>
    </header>
  );
};