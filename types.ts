export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'doc' | 'pdf' | 'video';
  size?: string;
  date: string;
  isFavorite?: boolean;
  parentId?: string | null;
  isTrashed?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
}

export type Theme = 'light' | 'dark';

export type ViewMode = 'grid' | 'list';