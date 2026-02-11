import { FileItem } from './types';

export const MOCK_FILES: FileItem[] = [
  // Root Level (parentId: null)
  { id: '1', name: 'Project Alpha Design', type: 'folder', date: 'Today', isFavorite: true, parentId: null },
  { id: '2', name: 'Q4 Financial Report.pdf', type: 'doc', size: '2.4 MB', date: 'Yesterday', parentId: null },
  { id: '3', name: 'Marketing Assets', type: 'folder', date: 'Oct 24, 2023', parentId: null },
  { id: '4', name: 'Launch Event.mp4', type: 'video', size: '154 MB', date: 'Oct 20, 2023', isFavorite: true, parentId: null },
  { id: '5', name: 'Hero Banner.png', type: 'image', size: '4.2 MB', date: 'Oct 18, 2023', parentId: null },
  { id: '6', name: 'Client Contracts', type: 'folder', date: 'Oct 15, 2023', parentId: null },
  
  // Inside "Project Alpha Design" (id: 1)
  { id: '1-1', name: 'Design Specs v2.pdf', type: 'pdf', size: '12 MB', date: 'Today', parentId: '1' },
  { id: '1-2', name: 'Wireframes', type: 'folder', date: 'Yesterday', parentId: '1' },
  { id: '1-3', name: 'Assets', type: 'folder', date: 'Yesterday', parentId: '1' },
  { id: '1-4', name: 'Moodboard.jpg', type: 'image', size: '5.6 MB', date: '2 days ago', parentId: '1' },

  // Inside "Wireframes" (id: 1-2) which is inside "Project Alpha"
  { id: '1-2-1', name: 'Home_v1.fig', type: 'doc', size: '450 KB', date: 'Yesterday', parentId: '1-2' },
  { id: '1-2-2', name: 'Profile_Flow.fig', type: 'doc', size: '320 KB', date: 'Yesterday', parentId: '1-2' },

  // Root Level Items continued
  { id: '7', name: 'Meeting Notes.docx', type: 'doc', size: '15 KB', date: 'Oct 12, 2023', parentId: null },
  { id: '8', name: 'User Research.pdf', type: 'doc', size: '1.2 MB', date: 'Oct 10, 2023', parentId: null },
  { id: '9', name: 'App Icon.png', type: 'image', size: '240 KB', date: 'Sep 28, 2023', parentId: null },
  { id: '10', name: 'System Architecture', type: 'folder', date: 'Sep 25, 2023', parentId: null },
  { id: '11', name: 'Budget 2024.xlsx', type: 'doc', size: '45 KB', date: 'Sep 20, 2023', isFavorite: true, parentId: null },
  { id: '12', name: 'Demo Recording.mov', type: 'video', size: '450 MB', date: 'Sep 15, 2023', parentId: null },
];