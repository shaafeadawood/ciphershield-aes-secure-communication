import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2 } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';

export const SystemLogs: React.FC = () => {
  const { logs, clearLogs } = useCipherStore();
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    const latestLog = logs[0]?.message ?? '';
    setTypedMessage('');

    if (!latestLog) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedMessage(latestLog.slice(0, index));

      if (index >= latestLog.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [logs]);

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

  const prefixColor = (prefix: string) => {
    switch (prefix) {
      case '[SYS]':
        return 'var(--color-cyan, #22d3ee)';
      case '[OK]':
        return 'var(--color-green, #4ade80)';
      case '[WARN]':
        return 'var(--color-amber, #fbbf24)';
      case '[ERR]':
        return 'var(--color-red, #f87171)';
      default:
        return undefined;
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
            logs.map((log, idx) => {
              // Split full message on first space to extract prefix token (e.g. "[SYS]")
              const full = log.message || '';
              const firstSpace = full.indexOf(' ');
              const prefix = firstSpace > -1 ? full.slice(0, firstSpace) : '';

              // For the animated latest message (idx === 0) we color only the prefix portion
              if (idx === 0) {
                const typed = typedMessage;
                const prefixLen = prefix ? prefix.length : 0;
                const left = typed.slice(0, Math.min(typed.length, prefixLen));
                const right = typed.length > prefixLen ? typed.slice(prefixLen) : '';

                return (
                  <motion.div
                    key={idx}
                    className={`flex gap-2 items-start ${getLogColor(log.type)} border-l-2 pl-2`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <span className="text-neon-cyan/50 flex-shrink-0">[{log.timestamp}]</span>
                    <span className="break-all">
                      {prefixLen > 0 ? (
                        <>
                          <span style={{ color: prefixColor(prefix) }}>{left}</span>
                          <span>{right}</span>
                        </>
                      ) : (
                        <>{typed}</>
                      )}
                      <span className="terminal-cursor" />
                    </span>
                  </motion.div>
                );
              }

              // For non-animated entries, render the full message but color only the prefix token
              const rest = firstSpace > -1 ? full.slice(firstSpace) : '';

              return (
                <motion.div
                  key={idx}
                  className={`flex gap-2 items-start ${getLogColor(log.type)} border-l-2 pl-2`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <span className="text-neon-cyan/50 flex-shrink-0">[{log.timestamp}]</span>
                  <span className="break-all">
                    {prefix ? (
                      <>
                        <span style={{ color: prefixColor(prefix) }}>{prefix}</span>
                        <span>{rest}</span>
                      </>
                    ) : (
                      <>{full}</>
                    )}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-neon-cyan/40 mt-2 text-center font-mono">
        CipherShield / live terminal stream | {logs.length} / 100 logs
      </p>
    </motion.div>
  );
};
