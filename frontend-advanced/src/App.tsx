import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useCipherStore } from './store/cipherStore';
import { Sidebar } from './components/Sidebar';
import { CyberSpace } from './components/3D/CyberSpace';
import { EncryptPanel } from './components/panels/EncryptPanel';
import { DecryptPanel } from './components/panels/DecryptPanel';
import { HistoryPanel } from './components/panels/HistoryPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { AboutPanel } from './components/panels/AboutPanel';
import { SystemLogs } from './components/SystemLogs';
import './index.css';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentTab, loading } = useCipherStore();

  const renderPanel = () => {
    switch (currentTab) {
      case 'encrypt':
        return <EncryptPanel />;
      case 'decrypt':
        return <DecryptPanel />;
      case 'history':
        return <HistoryPanel />;
      case 'simulation':
        return <SimulationPanel />;
      case 'about':
        return <AboutPanel />;
      default:
        return <EncryptPanel />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-950 to-black">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <CyberSpace isActive={!loading} />
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-screen flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          onMobileClose={() => setIsMobileOpen(false)} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            className="lg:hidden border-b border-neon-cyan/20 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between p-4">
              <h1 className="text-lg font-bold glow-text">CipherShield</h1>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {renderPanel()}
              </AnimatePresence>
            </div>
          </div>

          {/* System Logs */}
          <div className="h-32 border-t border-neon-cyan/20 overflow-hidden">
            <SystemLogs />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"></div>
              <p className="text-neon-cyan font-mono text-sm">Processing...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
