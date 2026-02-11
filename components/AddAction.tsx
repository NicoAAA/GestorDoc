import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus, FileUp } from 'lucide-react';

interface AddActionProps {
  onNewFolder: () => void;
  onUpload: () => void;
  isDarkMode: boolean;
}

export const AddAction: React.FC<AddActionProps> = ({ onNewFolder, onUpload, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Styles
  const menuBg = isDarkMode 
    ? 'bg-[#1c1c1e] border-[#38383a]' 
    : 'bg-white border-white/40';
  
  const itemHover = isDarkMode
    ? 'hover:bg-white/10'
    : 'hover:bg-gray-100';

  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="fixed bottom-24 md:bottom-10 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`flex flex-col p-2 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[180px] origin-bottom-right ${menuBg}`}
          >
            <button
              onClick={() => {
                onNewFolder();
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${itemHover}`}
            >
              <FolderPlus size={20} className="text-blue-500" />
              <span className={`font-medium ${textPrimary}`}>New Folder</span>
            </button>
            
            <button
              onClick={() => {
                onUpload();
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${itemHover}`}
            >
              <FileUp size={20} className="text-green-500" />
              <span className={`font-medium ${textPrimary}`}>Upload File</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.5)] flex items-center justify-center"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
};