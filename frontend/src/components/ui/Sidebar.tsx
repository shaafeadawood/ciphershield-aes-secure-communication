import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, History, Shield, Info } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';

interface NavItem {
  id: 'encrypt' | 'decrypt' | 'history' | 'simulation' | 'about';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'encrypt', label: 'Encrypt', icon: <Lock size={20} />, color: 'from-cyan-500 to-blue-500' },
  { id: 'decrypt', label: 'Decrypt', icon: <Unlock size={20} />, color: 'from-purple-500 to-pink-500' },
  { id: 'history', label: 'History', icon: <History size={20} />, color: 'from-green-500 to-emerald-500' },
  { id: 'simulation', label: 'Simulation', icon: <Shield size={20} />, color: 'from-orange-500 to-red-500' },
  { id: 'about', label: 'About', icon: <Info size={20} />, color: 'from-indigo-500 to-purple-500' },
];

export const Sidebar: React.FC<{ isMobileOpen: boolean; onMobileClose: () => void }> = ({ 
  isMobileOpen, 
  onMobileClose 
}) => {
  const { currentTab, setCurrentTab } = useCipherStore();

  const handleTabClick = (tab: typeof currentTab) => {
    setCurrentTab(tab);
    onMobileClose();
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0 },
  };

  return (
    <>
      {/* Mobile Close Button */}
      {isMobileOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onMobileClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Sidebar */}
      <motion.nav
        className={`fixed left-0 top-0 h-screen w-64 glass-panel lg:relative lg:rounded-none backdrop-blur-xl border-r border-neon-cyan/20 z-40 flex flex-col ${
          isMobileOpen ? 'block' : 'hidden lg:block'
        }`}
        variants={sidebarVariants}
        initial={isMobileOpen ? 'hidden' : 'visible'}
        animate={isMobileOpen ? 'visible' : 'visible'}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neon-cyan/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold glow-text">CipherShield</h1>
              <p className="text-xs text-neon-cyan/60 font-mono">v3.0 Advanced</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item, idx) => (
              <motion.button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  currentTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-neon-cyan/60 hover:text-neon-cyan hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {currentTab === item.id && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-white"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-neon-cyan/10">
          <p className="text-xs text-neon-cyan/40 text-center font-mono">
            AES-256-GCM Encryption
          </p>
        </div>
      </motion.nav>
    </>
  );
};
