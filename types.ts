export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'doc' | 'pdf' | 'video';
  size?: string;
  date: string;
  isFavorite?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
}

export type Theme = 'light' | 'dark';