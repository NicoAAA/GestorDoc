import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { FileCard } from './components/FileCard';
import { AddAction } from './components/AddAction';
import { CreateFolderModal } from './components/CreateFolderModal';
import { MOCK_FILES } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode, FileItem } from './types';
import { LayoutGrid, List, ChevronRight, Home, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Data State
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);

  // Folder Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // Modal States
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  // Header Visibility State
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Handle Theme Toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Reset folder when changing main tabs
  useEffect(() => {
    setCurrentFolderId(null);
  }, [activeTab]);

  // Apply Body Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Scroll
  const handleScroll = () => {
    if (!mainRef.current) return;
    const currentScrollY = mainRef.current.scrollTop;
    
    if (currentScrollY < 10) {
        setIsHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
    }

    if (currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
    } else {
        setIsHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Handle File/Folder Click
  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
        setCurrentFolderId(file.id);
        // Reset scroll position
        if (mainRef.current) mainRef.current.scrollTop = 0;
    } else {
        console.log("Opening file:", file.name);
    }
  };

  // Creation Handlers
  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
        id: Date.now().toString(),
        name: name,
        type: 'folder',
        date: 'Just now',
        parentId: currentFolderId
    };
    setFiles([newFolder, ...files]);
  };

  const handleUploadFile = () => {
    // Simulation of file upload
    const names = ['Project_Specs.pdf', 'Vacation.jpg', 'Budget.xlsx', 'Intro.mp4'];
    const types: FileItem['type'][] = ['pdf', 'image', 'doc', 'video'];
    const rand = Math.floor(Math.random() * names.length);
    
    const newFile: FileItem = {
        id: Date.now().toString(),
        name: names[rand],
        type: types[rand],
        date: 'Just now',
        size: '1.2 MB',
        parentId: currentFolderId
    };
    setFiles([newFile, ...files]);
  };

  // Calculate Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [];
    let currentId = currentFolderId;

    while (currentId) {
        const folder = files.find(f => f.id === currentId);
        if (folder) {
            crumbs.unshift(folder);
            currentId = folder.parentId || null;
        } else {
            break;
        }
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Filter Files
  const filteredFiles = files.filter(file => {
    if (currentFolderId) {
        return file.parentId === currentFolderId;
    }

    if (activeTab === 'all') {
        return file.parentId === null;
    }
    if (activeTab === 'favorites') {
        return file.isFavorite;
    }
    if (activeTab === 'recents') {
        return true; 
    }
    if (activeTab === 'cloud') {
        return file.type === 'folder' && file.parentId === null;
    }
    if (activeTab === 'trash') {
        return false; 
    }

    return true;
  });

  // Background Colors
  const bgStyle = isDarkMode ? 'bg-apple-dark text-white' : 'bg-apple-light text-gray-900';
  const listHeaderStyle = isDarkMode ? 'text-gray-500' : 'text-gray-400';
  const breadcrumbStyle = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';

  // Toggle Component
  const ViewToggle = () => (
    <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
        <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-black shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
        >
            <LayoutGrid size={18} />
        </button>
        <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-black shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
        >
            <List size={18} />
        </button>
    </div>
  );

  const ListHeader = () => (
    <div className={`grid grid-cols-12 px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${listHeaderStyle}`}>
        <div className="col-span-8 md:col-span-5">Name</div>
        <div className="col-span-4 md:col-span-3 text-right md:text-left">Date</div>
        <div className="hidden md:block md:col-span-2">Size</div>
        <div className="hidden md:block md:col-span-2">Kind</div>
    </div>
  );

  const getRootLabel = () => {
      switch(activeTab) {
          case 'all': return 'Home';
          case 'recent': return 'Recents';
          case 'favorites': return 'Favorites';
          case 'cloud': return 'iCloud';
          case 'trash': return 'Trash';
          default: return 'Files';
      }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${bgStyle}`}>
      
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <div className="flex-1 flex flex-col h-full w-full transition-all duration-300 relative">
        
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          title={activeTab === 'all' ? 'All Files' : getRootLabel()}
          visible={isHeaderVisible}
        />

        {/* Breadcrumb Bar */}
        {(currentFolderId !== null || activeTab === 'all') && (
             <div className={`px-6 pt-2 pb-1 flex items-center gap-1 text-sm overflow-x-auto no-scrollbar whitespace-nowrap z-20 transition-all duration-300 ${!isHeaderVisible ? '-mt-4 opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {currentFolderId && (
                    <button 
                        onClick={() => {
                            const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].id : null;
                            setCurrentFolderId(parent);
                        }}
                        className={`mr-2 md:hidden ${isDarkMode ? 'text-white' : 'text-black'}`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}

                <button 
                    onClick={() => setCurrentFolderId(null)}
                    className={`flex items-center gap-1 transition-colors ${currentFolderId === null ? (isDarkMode ? 'text-white font-medium' : 'text-black font-medium') : breadcrumbStyle}`}
                >
                    <Home size={14} className="mb-0.5" />
                    <span>{getRootLabel()}</span>
                </button>
                
                {breadcrumbs.map((crumb, index) => {
                     const isLast = index === breadcrumbs.length - 1;
                     return (
                        <div key={crumb.id} className="flex items-center gap-1">
                            <ChevronRight size={14} className="text-gray-600" />
                            <button
                                onClick={() => !isLast && setCurrentFolderId(crumb.id)}
                                className={`transition-colors ${isLast ? (isDarkMode ? 'text-white font-medium' : 'text-black font-medium cursor-default') : breadcrumbStyle}`}
                                disabled={isLast}
                            >
                                {crumb.name}
                            </button>
                        </div>
                     );
                })}
            </div>
        )}

        <main 
            ref={mainRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 no-scrollbar scroll-smooth"
        >
          
          {/* Recent Section */}
          {activeTab === 'all' && currentFolderId === null && (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium opacity-70">Recently Accessed</h2>
                    <ViewToggle />
                </div>
                
                {viewMode === 'list' && <ListHeader />}

                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                    : "flex flex-col space-y-1"
                }>
                    {files.slice(0, 4).map((file, index) => (
                        <FileCard 
                            key={`quick-${file.id}`} 
                            file={file} 
                            isDarkMode={isDarkMode} 
                            viewMode={viewMode} 
                            index={index} 
                            onClick={handleFileClick}
                        />
                    ))}
                </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium opacity-70">
                {currentFolderId ? breadcrumbs[breadcrumbs.length - 1]?.name : (activeTab === 'all' ? 'Files' : getRootLabel())}
            </h2>
            {(activeTab !== 'all' || currentFolderId !== null) && <ViewToggle />}
          </div>
          
          {viewMode === 'list' && <ListHeader />}

          <motion.div 
            className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col space-y-1"
            }
          >
            <AnimatePresence mode='popLayout'>
              {filteredFiles.map((file, index) => (
                <FileCard 
                    key={file.id} 
                    file={file} 
                    isDarkMode={isDarkMode} 
                    viewMode={viewMode}
                    index={index}
                    onClick={handleFileClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>

           {filteredFiles.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-64 flex flex-col items-center justify-center opacity-40 text-center"
            >
                <div className="mb-4 p-4 rounded-full bg-gray-500/10">
                    <LayoutGrid size={40} />
                </div>
                <p>No files in this folder.</p>
            </motion.div>
          )}

        </main>

        {/* Floating Action Button */}
        <AddAction 
            onNewFolder={() => setIsNewFolderModalOpen(true)}
            onUpload={handleUploadFile}
            isDarkMode={isDarkMode}
        />

        {/* Modal */}
        <CreateFolderModal 
            isOpen={isNewFolderModalOpen}
            onClose={() => setIsNewFolderModalOpen(false)}
            onCreate={handleCreateFolder}
            isDarkMode={isDarkMode}
        />

      </div>
    </div>
  );
};

export default App;