import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { FileCard } from './components/FileCard';
import { AddAction } from './components/AddAction';
import { CreateFolderModal } from './components/CreateFolderModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { SettingsView } from './components/SettingsView';
import { MOCK_FILES } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode, FileItem } from './types';
import { LayoutGrid, List, ChevronRight, Home, ArrowLeft } from 'lucide-react';

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20
};

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Data State
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);

  // Folder Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // 1 = Enter (Zoom In), -1 = Exit (Zoom Out)
  
  // Modal States
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; file: FileItem | null }>({
    isOpen: false,
    file: null
  });

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
    setDirection(0);
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
        setDirection(1); // Moving forward/deeper
        setTimeout(() => setCurrentFolderId(file.id), 10); // Slight delay for ripple/tap effect
        
        // Reset scroll position
        if (mainRef.current) mainRef.current.scrollTop = 0;
    } else {
        console.log("Opening file:", file.name);
    }
  };

  const handleNavigateUp = (targetId: string | null) => {
      setDirection(-1); // Moving back/up
      setCurrentFolderId(targetId);
  };

  // --- Deletion & Restore Handlers ---
  const handleRequestDelete = (file: FileItem) => {
    setDeleteModal({ isOpen: true, file });
  };

  const handleRestoreFile = (file: FileItem) => {
    setFiles(prevFiles => prevFiles.map(f => 
        f.id === file.id ? { ...f, isTrashed: false } : f
    ));
  };

  const confirmDelete = () => {
    if (deleteModal.file) {
      const isAlreadyTrashed = deleteModal.file.isTrashed;

      if (isAlreadyTrashed) {
        // Permanent Delete
        setFiles(prevFiles => prevFiles.filter(f => f.id !== deleteModal.file!.id));
      } else {
        // Move to Trash
        setFiles(prevFiles => prevFiles.map(f => 
          f.id === deleteModal.file!.id ? { ...f, isTrashed: true } : f
        ));
      }
      setDeleteModal({ isOpen: false, file: null });
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

  // Filter Files Logic
  const filteredFiles = files.filter(file => {
    // If we are looking at Trash tab, only show trashed items
    if (activeTab === 'trash') {
      return file.isTrashed;
    }

    // For all other tabs, hide trashed items
    if (file.isTrashed) {
      return false;
    }

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
    
    return true;
  });

  // Background Colors with texture hint
  const bgStyle = isDarkMode ? 'bg-apple-dark text-white' : 'bg-apple-light text-gray-900';
  const listHeaderStyle = isDarkMode ? 'text-gray-500' : 'text-gray-400';
  const breadcrumbStyle = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';

  // Toggle Component
  const ViewToggle = () => (
    <div className={`flex p-1 rounded-xl backdrop-blur-xl ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
        <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? (isDarkMode ? 'bg-gray-600 text-white shadow-lg' : 'bg-white text-black shadow-lg') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
        >
            <LayoutGrid size={18} />
        </button>
        <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? (isDarkMode ? 'bg-gray-600 text-white shadow-lg' : 'bg-white text-black shadow-lg') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
        >
            <List size={18} />
        </button>
    </div>
  );

  const ListHeader = () => (
    <div className={`grid grid-cols-12 px-3 mb-2 text-xs font-bold uppercase tracking-widest ${listHeaderStyle}`}>
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
          case 'settings': return 'Settings';
          default: return 'Files';
      }
  };

  // Animation Variants for Container "Morphing"
  const containerVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
      scale: 1.05,
      filter: "blur(4px)"
    })
  };

  const isSettingsActive = activeTab === 'settings';

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
          title={isSettingsActive ? 'Settings' : (activeTab === 'all' ? 'All Files' : getRootLabel())}
          visible={isHeaderVisible}
        />

        {/* Breadcrumb Bar - Hidden in Settings */}
        {!isSettingsActive && (currentFolderId !== null || activeTab === 'all') && (
             <motion.div 
                layout
                className={`px-6 pt-2 pb-1 flex items-center gap-1 text-sm overflow-x-auto no-scrollbar whitespace-nowrap z-20 transition-all duration-300 ${!isHeaderVisible ? '-mt-4 opacity-0 pointer-events-none' : 'opacity-100'}`}
             >
                {currentFolderId && (
                    <button 
                        onClick={() => {
                            const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].id : null;
                            handleNavigateUp(parent);
                        }}
                        className={`mr-2 md:hidden ${isDarkMode ? 'text-white' : 'text-black'}`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}

                <button 
                    onClick={() => handleNavigateUp(null)}
                    className={`flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 ${currentFolderId === null ? (isDarkMode ? 'text-white font-bold' : 'text-black font-bold') : breadcrumbStyle}`}
                >
                    <Home size={14} className="mb-0.5" />
                    <span>{getRootLabel()}</span>
                </button>
                
                {breadcrumbs.map((crumb, index) => {
                     const isLast = index === breadcrumbs.length - 1;
                     return (
                        <div key={crumb.id} className="flex items-center gap-1">
                            <ChevronRight size={14} className="text-gray-600" />
                            <motion.button
                                layoutId={`crumb-${crumb.id}`}
                                onClick={() => !isLast && handleNavigateUp(crumb.id)}
                                className={`transition-colors px-2 py-1 rounded-lg hover:bg-white/5 ${isLast ? (isDarkMode ? 'text-white font-bold' : 'text-black font-bold cursor-default') : breadcrumbStyle}`}
                                disabled={isLast}
                            >
                                {crumb.name}
                            </motion.button>
                        </div>
                     );
                })}
            </motion.div>
        )}

        <main 
            ref={mainRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 no-scrollbar scroll-smooth"
        >
          
          {/* RENDER SETTINGS VIEW */}
          {isSettingsActive ? (
            <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          ) : (
            <>
                {/* Recent Section - Only on Root & Not Settings */}
                {activeTab === 'all' && currentFolderId === null && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold opacity-80 tracking-tight">Recently Accessed</h2>
                            <ViewToggle />
                        </div>
                        
                        {viewMode === 'list' && <ListHeader />}

                        <motion.div 
                            layout
                            className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                            : "flex flex-col space-y-2"
                        }>
                            {files.slice(0, 4).filter(f => !f.isTrashed).map((file, index) => (
                                <FileCard 
                                    key={`quick-${file.id}`} 
                                    file={file} 
                                    isDarkMode={isDarkMode} 
                                    viewMode={viewMode} 
                                    index={index} 
                                    onClick={handleFileClick}
                                    onDelete={handleRequestDelete}
                                    onRestore={handleRestoreFile}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Sub-header Controls */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold opacity-80 tracking-tight">
                        {currentFolderId ? breadcrumbs[breadcrumbs.length - 1]?.name : (activeTab === 'all' ? 'Files' : getRootLabel())}
                    </h2>
                    {/* View Toggle logic: show only if we are NOT in root 'All' (since that has the specific Recent header above) or if we are in a folder */}
                    {(activeTab !== 'all' || currentFolderId !== null) && <ViewToggle />}
                </div>
                
                {viewMode === 'list' && <ListHeader />}

                {/* Shared Layout Container with Spring Transitions */}
                <AnimatePresence mode='popLayout' custom={direction}>
                    <motion.div 
                        key={currentFolderId || 'root'}
                        custom={direction}
                        variants={containerVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: springTransition,
                            opacity: { duration: 0.2 },
                            scale: springTransition,
                            filter: { duration: 0.2 }
                        }}
                        className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "flex flex-col space-y-2"
                        }
                    >
                    {filteredFiles.map((file, index) => (
                        <FileCard 
                            key={file.id} 
                            file={file} 
                            isDarkMode={isDarkMode} 
                            viewMode={viewMode}
                            index={index}
                            onClick={handleFileClick}
                            onDelete={handleRequestDelete}
                            onRestore={handleRestoreFile}
                        />
                    ))}

                    {filteredFiles.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="col-span-full h-64 flex flex-col items-center justify-center opacity-40 text-center"
                        >
                            <div className="mb-4 p-6 rounded-3xl bg-gray-500/10 backdrop-blur-md">
                                <LayoutGrid size={48} />
                            </div>
                            <p className="font-medium">No files in this folder.</p>
                        </motion.div>
                    )}
                    </motion.div>
                </AnimatePresence>
            </>
          )}

        </main>

        {/* Floating Action Button - Only show if NOT in settings and NOT in Trash */}
        {!isSettingsActive && activeTab !== 'trash' && (
            <AddAction 
                onNewFolder={() => setIsNewFolderModalOpen(true)}
                onUpload={handleUploadFile}
                isDarkMode={isDarkMode}
            />
        )}

        {/* Create Modal */}
        <CreateFolderModal 
            isOpen={isNewFolderModalOpen}
            onClose={() => setIsNewFolderModalOpen(false)}
            onCreate={handleCreateFolder}
            isDarkMode={isDarkMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, file: null })}
            onConfirm={confirmDelete}
            fileName={deleteModal.file?.name || 'File'}
            isDarkMode={isDarkMode}
            isTrashed={deleteModal.file?.isTrashed}
        />

      </div>
    </div>
  );
};

export default App;