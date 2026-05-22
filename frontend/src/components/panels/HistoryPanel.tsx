import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Clock, Shield } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';

export const HistoryPanel: React.FC = () => {
  const { history, clearHistory, addLog } = useCipherStore();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied to clipboard', 'success');
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} /> Encryption History
        </h3>
        {history.length > 0 && (
          <motion.button
            onClick={() => {
              clearHistory();
              addLog('History cleared', 'info');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all flex items-center gap-1"
          >
            <Trash2 size={12} /> Clear
          </motion.button>
        )}
      </div>

      {/* History List */}
      <div className="glass-panel p-4 max-h-96 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              className="py-8 text-center text-neon-cyan/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No encryption history yet</p>
              <p className="text-xs mt-1">Encrypt messages to see them here</p>
            </motion.div>
          ) : (
            history.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 bg-black/50 border border-neon-cyan/20 rounded-lg hover:border-neon-cyan/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-neon-cyan/50">
                    #{idx + 1} - {item.timestamp}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 rounded-full border border-neon-cyan/20 text-[10px] uppercase tracking-[0.25em] text-neon-cyan/60 flex items-center gap-1">
                      <Shield size={10} /> {item.mode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.plaintext)}
                      title="Copy plaintext"
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.ciphertext)}
                      title="Copy ciphertext"
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-neon-cyan/60 mb-1">Plaintext:</div>
                    <div className="p-2 bg-black/80 rounded border border-neon-cyan/10 text-white break-words max-h-16 overflow-y-auto">
                      {item.plaintext}
                    </div>
                  </div>
                  <div>
                    <div className="text-neon-cyan/60 mb-1">Ciphertext:</div>
                    <div className="p-2 bg-black/80 rounded border border-neon-cyan/10 text-neon-cyan/70 break-all font-mono max-h-16 overflow-y-auto">
                      {item.ciphertext}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-neon-cyan/60 mb-1">Nonce:</div>
                      <div className="p-2 bg-black/80 rounded border border-neon-cyan/10 text-white break-all font-mono max-h-16 overflow-y-auto">
                        {item.nonce || 'Not stored'}
                      </div>
                    </div>
                    <div>
                      <div className="text-neon-cyan/60 mb-1">Auth Tag:</div>
                      <div className="p-2 bg-black/80 rounded border border-neon-cyan/10 text-white break-all font-mono max-h-16 overflow-y-auto">
                        {item.tag || 'Not stored'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-neon-cyan/40 font-mono">
        Total: {history.length} / 50 entries
      </p>
    </motion.div>
  );
};
