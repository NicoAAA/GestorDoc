import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, File, MoreHorizontal, Folder, Video } from 'lucide-react';
import { FileItem, ViewMode } from '../types';

interface FileCardProps {
  file: FileItem;
  isDarkMode: boolean;
  viewMode: ViewMode;
  index?: number;
  onClick: (file: FileItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, isDarkMode, viewMode, index = 0, onClick }) => {
  const getIcon = (size: number) => {
    switch (file.type) {
      case 'folder': return <Folder className="text-blue-500" size={size} strokeWidth={1.5} />;
      case 'image': return <Image className="text-purple-500" size={size} strokeWidth={1.5} />;
      case 'doc': return <FileText className="text-orange-500" size={size} strokeWidth={1.5} />;
      case 'video': return <Video className="text-green-500" size={size} strokeWidth={1.5} />;
      default: return <File className="text-gray-400" size={size} strokeWidth={1.5} />;
    }
  };

  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // --- GRID VIEW ---
  if (viewMode === 'grid') {
    const cardStyles = isDarkMode
        ? 'bg-[rgba(28,28,30,0.5)] border-white/10 hover:bg-[rgba(44,44,46,0.6)]'
        : 'bg-[rgba(255,255,255,0.6)] border-white/40 hover:bg-[rgba(255,255,255,0.9)]';

    return (
        <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8
        }}
        whileHover={{ 
            y: -5,
            scale: 1.02,
            boxShadow: isDarkMode ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.1)'
        }}
        onClick={() => onClick(file)}
        className={`group relative flex flex-col p-4 rounded-[18px] border backdrop-blur-xl transition-colors duration-300 cursor-pointer ${cardStyles}`}
        >
            {/* Glow Effect on Hover */}
            <div className={`absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                isDarkMode ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]'
            }`} />

        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                {getIcon(40)}
            </div>
            <button className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 ${textSecondary}`}>
            <MoreHorizontal size={18} />
            </button>
        </div>

        <div className="mt-auto">
            <h3 className={`font-medium text-sm truncate pr-2 ${textPrimary}`}>{file.name}</h3>
            <div className={`flex items-center justify-between mt-1 text-xs ${textSecondary}`}>
            <span>{file.date}</span>
            <span>{file.size || '—'}</span>
            </div>
        </div>
        </motion.div>
    );
  }

  // --- LIST VIEW ---
  const rowHover = isDarkMode 
    ? 'hover:bg-white/10 hover:border-white/10' 
    : 'hover:bg-white/60 hover:border-black/5';

  const stripeBg = index % 2 === 0 ? 'bg-transparent' : (isDarkMode ? 'bg-white/[0.02]' : 'bg-black/[0.02]');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 40,
        delay: index * 0.03 
      }}
      onClick={() => onClick(file)}
      className={`grid grid-cols-12 items-center p-3 rounded-xl cursor-pointer border border-transparent transition-all group ${stripeBg} ${rowHover}`}
    >
        {/* Name Column */}
        <div className="col-span-8 md:col-span-5 flex items-center gap-3 md:gap-4 overflow-hidden">
            <div className="shrink-0">
                {getIcon(24)}
            </div>
            <div className="truncate flex flex-col justify-center">
                <p className={`text-sm font-medium truncate transition-colors ${textPrimary}`}>{file.name}</p>
                <p className={`md:hidden text-[10px] ${textSecondary}`}>{file.size || '—'}</p>
            </div>
        </div>

        {/* Date Column */}
        <div className={`col-span-4 md:col-span-3 text-right md:text-left text-xs ${textSecondary}`}>
            {file.date}
        </div>

        {/* Size Column (Desktop) */}
        <div className={`hidden md:block md:col-span-2 text-xs ${textSecondary}`}>
            {file.size || '—'}
        </div>

        {/* Type Column (Desktop) */}
        <div className={`hidden md:block md:col-span-2 text-xs capitalize ${textSecondary}`}>
            {file.type}
        </div>
        
    </motion.div>
  );
};