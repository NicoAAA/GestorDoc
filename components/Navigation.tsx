import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  Clock, 
  Cloud, 
  Star, 
  Trash2, 
  Settings, 
  HardDrive 
} from 'lucide-react';
import { NavigationItem } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isDarkMode: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const navItems: NavigationItem[] = [
  { id: 'all', label: 'All Files', icon: HardDrive },
  { id: 'recent', label: 'Recents', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'cloud', label: 'iCloud Drive', icon: Cloud },
  { id: 'trash', label: 'Trash', icon: Trash2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  isExpanded, 
  setIsExpanded 
}) => {
  
  // Dimensions
  const collapsedWidth = 68;
  const expandedWidth = 250;

  // Ultra-Premium Glass Styles with Liquid Tint
  const glassStyles = isDarkMode
    ? 'bg-gradient-to-b from-[#2a2a2c]/70 to-[#1c1c1e]/70 border-r border-white/10 text-gray-400 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]'
    : 'bg-gradient-to-b from-white/80 to-[#f2f2f7]/70 border-r border-white/40 text-gray-500 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.1)]';

  const hoverStyles = isDarkMode
    ? 'hover:text-gray-100 hover:bg-white/5'
    : 'hover:text-gray-900 hover:bg-black/5';

  // Active State: Text color + Glow, no background box
  const activeStyles = 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]';

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ width: collapsedWidth }}
        animate={{ width: isExpanded ? expandedWidth : collapsedWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden md:flex flex-col h-full backdrop-blur-[80px] saturate-[180%] z-40 flex-shrink-0 transition-all duration-500 ${glassStyles}`}
      >
        {/* Header / Logo Area */}
        <div className="h-20 flex items-center w-full overflow-hidden relative z-20">
            <div style={{ width: collapsedWidth }} className="flex-shrink-0 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-blue-500/20`} />
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`font-semibold text-lg tracking-tight whitespace-nowrap pl-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
                >
                  Cupertino
                </motion.span>
              )}
            </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive ? activeStyles : hoverStyles
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                    <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* Icon Container */}
                <div style={{ width: collapsedWidth - 16 }} className="flex-shrink-0 flex items-center justify-center z-10">
                    <Icon 
                        size={22} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                    />
                </div>

                {/* Label */}
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="font-medium text-sm whitespace-nowrap pl-1 z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        
        {/* Storage Widget */}
        <div className="p-0 overflow-hidden z-10">
             <div className="flex items-center justify-center mb-6">
                <div style={{ width: collapsedWidth - 16 }} className="flex flex-col items-center">
                    {!isExpanded && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                </div>
                
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 pr-6"
                    >
                        <div className={`flex justify-between text-xs mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>Storage</span>
                            <span>45%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-400/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </motion.div>
                )}
             </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Tab Bar - Centered Grid Layout */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-20 pb-4 border-t backdrop-blur-[40px] saturate-150 z-50 transition-colors duration-500 ${glassStyles}`}>
        <div className="h-full max-w-lg mx-auto grid grid-cols-5 items-center">
            {navItems.slice(0, 5).map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${isActive ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'opacity-70'}`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                )
            })}
        </div>
      </div>
    </>
  );
};