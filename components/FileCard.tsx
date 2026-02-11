import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, File, MoreHorizontal, Folder, Video, Trash2, X, RotateCcw } from 'lucide-react';
import { FileItem, ViewMode } from '../types';

interface FileCardProps {
  file: FileItem;
  isDarkMode: boolean;
  viewMode: ViewMode;
  index?: number;
  onClick: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onRestore: (file: FileItem) => void;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20
};

export const FileCard: React.FC<FileCardProps> = ({ file, isDarkMode, viewMode, index = 0, onClick, onDelete, onRestore }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getIcon = (size: number) => {
    switch (file.type) {
      case 'folder': return <Folder className="text-blue-500" size={size} strokeWidth={1.5} />;
      case 'image': return <Image className="text-purple-500" size={size} strokeWidth={1.5} />;
      case 'doc': return <FileText className="text-orange-500" size={size} strokeWidth={1.5} />;
      case 'video': return <Video className="text-green-500" size={size} strokeWidth={1.5} />;
      default: return <File className="text-gray-400" size={size} strokeWidth={1.5} />;
    }
  };

  const formatKind = (type: string) => {
    switch (type) {
        case 'pdf': return 'PDF';
        case 'doc': return 'Document';
        case 'image': return 'Image';
        case 'video': return 'Video';
        case 'folder': return 'Folder';
        default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // --- MENU COMPONENT ---
  const ActionMenu = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`absolute z-50 min-w-[180px] p-1.5 rounded-xl border shadow-2xl backdrop-blur-xl ${
            isDarkMode 
            ? 'bg-[#1c1c1e]/90 border-white/10' 
            : 'bg-white/90 border-black/5'
        } ${viewMode === 'list' ? '' : 'right-4 top-12'}`}
        style={viewMode === 'list' ? {
            left: menuPosition.x,
            top: menuPosition.y,
        } : {}}
        onClick={(e) => e.stopPropagation()}
    >
        {file.isTrashed ? (
            <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onRestore(file);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-500 hover:bg-blue-500/10 transition-colors mb-1"
                >
                    <RotateCcw size={16} />
                    Restore
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(file);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 size={16} />
                    Delete Forever
                </button>
            </>
        ) : (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(file);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
                <Trash2 size={16} />
                Delete
            </button>
        )}
        
        <div className={`my-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

        <button
            onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
            }}
             className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${textSecondary}`}
        >
            <X size={16} />
            Cancel
        </button>
    </motion.div>
  );

  // --- EVENT HANDLERS ---
  
  // Grid: 3-dots click
  const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuPosition({ x: 0, y: 0 }); // Reset for grid (uses absolute)
      setShowMenu(!showMenu);
  };

  // List & Grid: Right Click
  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (viewMode === 'list' && cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          // Calculate relative position within the row
          setMenuPosition({ 
              x: e.clientX - rect.left, 
              y: e.clientY - rect.top 
          });
      } else {
          setMenuPosition({ x: e.clientX, y: e.clientY });
      }
      setShowMenu(true);
  };

  // Touch: Long Press
  const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      longPressTimer.current = setTimeout(() => {
          if (viewMode === 'list' && cardRef.current) {
              const rect = cardRef.current.getBoundingClientRect();
              setMenuPosition({ x: clientX - rect.left, y: clientY - rect.top });
          } else {
              setMenuPosition({ x: clientX, y: clientY });
          }
          setShowMenu(true);
      }, 600); // 600ms long press
  };

  const handleTouchEnd = () => {
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  const handleTouchMove = () => {
       if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  // Close menu when clicking outside
  useEffect(() => {
      const handleClickOutside = () => setShowMenu(false);
      if (showMenu) {
          window.addEventListener('click', handleClickOutside);
      }
      return () => window.removeEventListener('click', handleClickOutside);
  }, [showMenu]);


  // --- GRID VIEW ---
  if (viewMode === 'grid') {
    const cardStyles = isDarkMode
        ? 'bg-black/20 border-white/10 hover:bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]'
        : 'bg-white/40 border-white/40 hover:bg-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]';

    return (
        <motion.div
            layout
            layoutId={`file-${file.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springTransition}
            whileHover={{ 
                y: -8,
                scale: 1.03,
                transition: springTransition
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onClick(file)}
            onContextMenu={handleContextMenu}
            className={`group relative flex flex-col p-4 rounded-[24px] border backdrop-blur-[40px] saturate-[180%] transition-colors duration-300 cursor-pointer ${cardStyles}`}
        >
            {/* Glossy Reflection Gradient */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Context Menu */}
            <AnimatePresence>
                {showMenu && <ActionMenu />}
            </AnimatePresence>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <motion.div 
                  className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-white/20'}`}
                  whileHover={{ rotate: file.type === 'folder' ? -5 : 0 }}
                  transition={springTransition}
                >
                    {getIcon(42)}
                </motion.div>
                <button 
                    onClick={handleMenuClick}
                    className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${showMenu ? 'opacity-100 bg-black/5 dark:bg-white/10' : 'opacity-0 group-hover:opacity-100'} ${textSecondary}`}
                >
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="mt-auto relative z-10">
                <h3 className={`font-medium text-[15px] truncate pr-2 tracking-tight ${textPrimary}`}>{file.name}</h3>
                <div className={`flex items-center justify-between mt-1.5 text-xs font-medium ${textSecondary}`}>
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
      layout
      layoutId={`file-${file.id}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        ...springTransition,
        delay: index * 0.05 
      }}
      ref={cardRef}
      onClick={() => onClick(file)}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className={`relative grid grid-cols-12 items-center p-3 rounded-2xl cursor-pointer border border-transparent transition-all group backdrop-blur-md select-none ${stripeBg} ${rowHover} ${showMenu ? 'z-20' : 'z-0'}`}
    >
        {/* Context Menu */}
        <AnimatePresence>
            {showMenu && <ActionMenu />}
        </AnimatePresence>

        {/* Name Column */}
        <div className="col-span-8 md:col-span-5 flex items-center gap-4 overflow-hidden">
            <motion.div 
                className="shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={springTransition}
            >
                {getIcon(26)}
            </motion.div>
            <div className="truncate flex flex-col justify-center">
                <p className={`text-[15px] font-medium truncate transition-colors ${textPrimary}`}>{file.name}</p>
                <p className={`md:hidden text-[11px] ${textSecondary}`}>{file.size || '—'}</p>
            </div>
        </div>

        {/* Date Column */}
        <div className={`col-span-4 md:col-span-3 text-right md:text-left text-xs font-medium ${textSecondary}`}>
            {file.date}
        </div>

        {/* Size Column (Desktop) */}
        <div className={`hidden md:block md:col-span-2 text-xs font-medium ${textSecondary}`}>
            {file.size || '—'}
        </div>

        {/* Type Column (Desktop) */}
        <div className={`hidden md:block md:col-span-2 text-xs font-medium ${textSecondary}`}>
            {formatKind(file.type)}
        </div>
        
    </motion.div>
  );
};