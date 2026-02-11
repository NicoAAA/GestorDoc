import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isDarkMode: boolean;
  isTrashed?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  isDarkMode,
  isTrashed = false
}) => {
  const modalBg = isDarkMode 
    ? 'bg-[#1c1c1e] border-gray-700' 
    : 'bg-white border-gray-200';

  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const title = isTrashed ? 'Delete Permanently?' : 'Move to Trash?';
  const message = isTrashed 
    ? <span>This action cannot be undone. Are you sure you want to permanently delete <span className={`font-medium ${textPrimary}`}>"{fileName}"</span>?</span>
    : <span>Are you sure you want to move <span className={`font-medium ${textPrimary}`}>"{fileName}"</span> to the trash? You can restore it later.</span>;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none p-4"
          >
            <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border ${modalBg}`}>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className={`text-lg font-semibold ${textPrimary}`}>
                      {title}
                    </h3>
                  </div>
                  <button 
                    onClick={onClose}
                    className={`p-1 rounded-full hover:bg-gray-500/10 transition-colors ${textSecondary}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className={`text-sm mb-6 ${textSecondary}`}>
                  {message}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    {isTrashed ? 'Delete Forever' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};