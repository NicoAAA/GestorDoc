import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, File, MoreHorizontal, Folder, Video, Music } from 'lucide-react';
import { FileItem } from '../types';

interface FileCardProps {
  file: FileItem;
  isDarkMode: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({ file, isDarkMode }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'folder': return <Folder className="text-blue-500" size={40} strokeWidth={1.5} />;
      case 'image': return <Image className="text-purple-500" size={40} strokeWidth={1.5} />;
      case 'doc': return <FileText className="text-orange-500" size={40} strokeWidth={1.5} />;
      case 'video': return <Video className="text-green-500" size={40} strokeWidth={1.5} />;
      default: return <File className="text-gray-400" size={40} strokeWidth={1.5} />;
    }
  };

  const cardStyles = isDarkMode
    ? 'bg-[rgba(28,28,30,0.5)] border-white/10 hover:bg-[rgba(44,44,46,0.6)]'
    : 'bg-[rgba(255,255,255,0.6)] border-white/40 hover:bg-[rgba(255,255,255,0.9)]';

  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div
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
      className={`group relative flex flex-col p-4 rounded-[18px] border backdrop-blur-xl transition-colors duration-300 cursor-pointer ${cardStyles}`}
    >
        {/* Glow Effect on Hover */}
        <div className={`absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
            isDarkMode ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]'
        }`} />

      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
            {getIcon()}
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
};