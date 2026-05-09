import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2 } from 'lucide-react';
import { useCipherStore } from '../store/cipherStore';

export const SystemLogs: React.FC = () => {
  const { logs, clearLogs } = useCipherStore();

  const getLogColor = (type: 'info' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return 'text-neon-green border-l-neon-green';
      case 'error':
        return 'text-red-400 border-l-red-500';
      default:
        return 'text-neon-cyan border-l-neon-cyan';
    }
  };

  return (
    <motion.div
      className="glass-panel p-4 h-full flex flex-col border-t border-neon-cyan/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-neon-cyan/20">
        <h3 className="text-sm font-bold text-neon-cyan/80 flex items-center gap-2 uppercase tracking-wider">
          <Terminal size={16} /> System Terminal
        </h3>
        {logs.length > 0 && (
          <button
            onClick={() => clearLogs()}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Clear logs"
          >
            <Trash2 size={14} className="text-neon-cyan/60 hover:text-neon-cyan" />
          </button>
        )}
      </div>

      {/* Logs Container */}
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 bg-black/30 rounded p-3 border border-neon-cyan/10">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              className="text-neon-cyan/40 text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Terminal size={20} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">No logs yet</p>
            </motion.div>
          ) : (
            logs.map((log, idx) => (
              <motion.div
                key={idx}
                className={`flex gap-2 items-start ${getLogColor(log.type)} border-l-2 pl-2`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <span className="text-neon-cyan/50 flex-shrink-0">[{log.timestamp}]</span>
                <span className="break-all">{log.message}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-neon-cyan/40 mt-2 text-center">
        {logs.length} / 100 logs
      </p>
    </motion.div>
  );
};
