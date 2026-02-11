import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { FileCard } from './components/FileCard';
import { MOCK_FILES } from './constants';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Sidebar State (Lifted up to control layout)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Handle Theme Toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply Body Class for Global Styles
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Filter Files
  const filteredFiles = MOCK_FILES.filter(file => {
    if (activeTab === 'all') return true;
    if (activeTab === 'favorites') return file.isFavorite;
    if (activeTab === 'recents') return true;
    if (activeTab === 'cloud') return file.type === 'folder';
    return true;
  });

  // Background Colors
  const bgStyle = isDarkMode ? 'bg-apple-dark text-white' : 'bg-apple-light text-gray-900';

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${bgStyle}`}>
      
      {/* Sidebar - Positioned relatively in flex container to push content */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* Main Content Area - Flex-1 takes remaining width */}
      <div className="flex-1 flex flex-col h-full w-full transition-all duration-300 relative">
        
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />

        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 no-scrollbar">
          
          {/* Quick Access / Section Title */}
          <div className="mb-8">
            <h2 className={`text-lg font-medium mb-4 opacity-70`}>Recently Accessed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_FILES.slice(0, 4).map((file) => (
                    <FileCard key={`quick-${file.id}`} file={file} isDarkMode={isDarkMode} />
                ))}
            </div>
          </div>

          <h2 className={`text-lg font-medium mb-4 opacity-70`}>Files</h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} isDarkMode={isDarkMode} />
              ))}
            </AnimatePresence>
          </motion.div>

           {filteredFiles.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-64 flex items-center justify-center opacity-40"
            >
                <p>No files found in this category.</p>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;