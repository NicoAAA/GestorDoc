import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Lock, 
  Globe, 
  ChevronRight, 
  User, 
  Moon, 
  Smartphone,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface UserPermission {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  avatarColor: string;
  hasAccessToConfidential: boolean;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20
};

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
  
  // Mock State for Permissions
  const [users, setUsers] = useState<UserPermission[]>([
    { id: '1', name: 'Sarah Connor', role: 'Admin', avatarColor: 'bg-blue-500', hasAccessToConfidential: true },
    { id: '2', name: 'John Doe', role: 'Editor', avatarColor: 'bg-green-500', hasAccessToConfidential: false },
    { id: '3', name: 'Jane Smith', role: 'Viewer', avatarColor: 'bg-purple-500', hasAccessToConfidential: false },
  ]);

  const [allowPublicLinks, setAllowPublicLinks] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);

  // Toggle User Role Logic
  const cycleRole = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const nextRole = user.role === 'Admin' ? 'Viewer' : user.role === 'Viewer' ? 'Editor' : 'Admin';
        return { ...user, role: nextRole };
      }
      return user;
    }));
  };

  const toggleConfidentialAccess = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, hasAccessToConfidential: !user.hasAccessToConfidential };
      }
      return user;
    }));
  };

  // Styles
  const sectionTitleStyle = `text-xs font-semibold uppercase tracking-wider mb-2 ml-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;
  const cardStyle = isDarkMode 
    ? 'bg-[#1c1c1e]/60 backdrop-blur-[40px] saturate-[180%] border border-white/5' 
    : 'bg-white/60 backdrop-blur-[40px] saturate-[180%] border border-white/40 shadow-sm';
  
  const itemHover = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderSeparator = isDarkMode ? 'border-gray-700/50' : 'border-gray-200/70';

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <motion.button 
        onClick={onToggle}
        layout
        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors duration-300 ${active ? 'bg-green-500' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
    >
        <motion.div 
            layout
            transition={springTransition}
            className={`w-5 h-5 rounded-full bg-white shadow-md ${active ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </motion.button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springTransition}
      className="max-w-3xl mx-auto pb-10"
    >
      
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 p-4">
         <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 shadow-lg border-4 border-transparent ring-2 ring-white/20" />
         <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Alex Morgan</h2>
            <p className={textSecondary}>Senior Administrator</p>
         </div>
      </div>

      {/* Permissions & Access Control */}
      <div className="mb-8">
        <h3 className={sectionTitleStyle}>Access Control & Permissions</h3>
        <div className={`rounded-2xl overflow-hidden ${cardStyle}`}>
            
            {/* Header for the list */}
            <div className={`grid grid-cols-12 px-4 py-3 text-xs font-semibold ${textSecondary} border-b ${borderSeparator}`}>
                <div className="col-span-5">User</div>
                <div className="col-span-3 text-center">Role</div>
                <div className="col-span-4 text-right">Confidential Access</div>
            </div>

            {users.map((user, index) => (
                <div key={user.id} className={`grid grid-cols-12 items-center px-4 py-3 border-b ${index === users.length - 1 ? 'border-none' : borderSeparator} ${itemHover} transition-colors`}>
                    
                    {/* User Info */}
                    <div className="col-span-5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold ${user.avatarColor}`}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${textPrimary}`}>{user.name}</p>
                            <p className={`text-[10px] ${textSecondary}`}>Last active: 2h ago</p>
                        </div>
                    </div>

                    {/* Role Toggler */}
                    <div className="col-span-3 flex justify-center">
                        <button 
                            onClick={() => cycleRole(user.id)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                                user.role === 'Admin' ? 'bg-red-500/10 text-red-500' :
                                user.role === 'Editor' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-gray-500/10 text-gray-500'
                            }`}
                        >
                            {user.role}
                        </button>
                    </div>

                    {/* Confidential Toggle */}
                    <div className="col-span-4 flex justify-end">
                        <Toggle active={user.hasAccessToConfidential} onToggle={() => toggleConfidentialAccess(user.id)} />
                    </div>
                </div>
            ))}
            
            <button className={`w-full py-3 text-sm font-medium text-blue-500 hover:bg-blue-500/5 transition-colors border-t ${borderSeparator}`}>
                + Invite New User
            </button>
        </div>
        <p className={`mt-2 ml-4 text-xs ${textSecondary}`}>
            Admins have full access. Editors can modify files but not settings.
        </p>
      </div>

      {/* Security Settings */}
      <div className="mb-8">
        <h3 className={sectionTitleStyle}>Security & Sharing</h3>
        <div className={`rounded-2xl overflow-hidden ${cardStyle}`}>
            
            <div className={`flex items-center justify-between px-4 py-4 border-b ${borderSeparator} ${itemHover}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Globe size={20} /></div>
                    <div>
                        <p className={`text-sm font-medium ${textPrimary}`}>Public Links</p>
                        <p className={`text-xs ${textSecondary}`}>Allow files to be shared externally</p>
                    </div>
                </div>
                <Toggle active={allowPublicLinks} onToggle={() => setAllowPublicLinks(!allowPublicLinks)} />
            </div>

            <div className={`flex items-center justify-between px-4 py-4 border-b ${borderSeparator} ${itemHover}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Shield size={20} /></div>
                    <div>
                        <p className={`text-sm font-medium ${textPrimary}`}>Require 2FA</p>
                        <p className={`text-xs ${textSecondary}`}>Enforce two-factor authentication for all users</p>
                    </div>
                </div>
                <Toggle active={require2FA} onToggle={() => setRequire2FA(!require2FA)} />
            </div>

            <div className={`flex items-center justify-between px-4 py-4 ${itemHover} cursor-pointer`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Lock size={20} /></div>
                    <p className={`text-sm font-medium ${textPrimary}`}>Password Policy</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs ${textSecondary}`}>Strong</span>
                    <ChevronRight size={16} className={textSecondary} />
                </div>
            </div>

        </div>
      </div>

      {/* Preferences */}
      <div className="mb-8">
        <h3 className={sectionTitleStyle}>Preferences</h3>
        <div className={`rounded-2xl overflow-hidden ${cardStyle}`}>
            <div className={`flex items-center justify-between px-4 py-4 ${itemHover}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Moon size={20} /></div>
                    <p className={`text-sm font-medium ${textPrimary}`}>Dark Mode</p>
                </div>
                <Toggle active={isDarkMode} onToggle={toggleTheme} />
            </div>
        </div>
      </div>

    </motion.div>
  );
};