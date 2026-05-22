import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2 } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';

export const SystemLogs: React.FC = () => {
  const { logs, clearLogs } = useCipherStore();
  const [typedMessage, setTypedMessage] = useState('');
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isPinnedRef = useRef(true);

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

  useEffect(() => {
    if (isPinnedRef.current) {
      bottomRef.current?.scrollIntoView({ block: 'end' });
    }
  }, [logs, typedMessage]);

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
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-neon-cyan/20">
        <h3 className="text-sm font-bold text-neon-cyan/80 flex items-center gap-2 uppercase tracking-wider">
          <Terminal size={16} /> System Terminal
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
            {logs.length}
          </span>
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

      <div
        ref={logContainerRef}
        onScroll={() => {
          const container = logContainerRef.current;
          if (!container) return;
          const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
          isPinnedRef.current = distanceFromBottom < 40;
        }}
        className="flex-1 overflow-y-auto font-mono text-xs space-y-1 bg-black/30 rounded p-3 border border-neon-cyan/10"
      >
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
              const full = log.message || '';
              const firstSpace = full.indexOf(' ');
              const prefix = firstSpace > -1 ? full.slice(0, firstSpace) : '';

              if (idx === 0) {
                const prefixLen = prefix ? prefix.length : 0;
                const typed = typedMessage;
                const typedPrefix = typed.slice(0, Math.min(typed.length, prefixLen));
                const typedRest = typed.length > prefixLen ? typed.slice(prefixLen) : '';
                const prefixTone = prefixColor(prefix);

                return (
                  <motion.div
                    key={`${log.timestamp}-${idx}`}
                    className={`flex gap-2 items-start ${getLogColor(log.type)} border-l-2 pl-2`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <span className="text-neon-cyan/50 flex-shrink-0">[{log.timestamp}]</span>
                    <span className="break-all inline-flex items-start gap-2">
                      {prefixLen > 0 && prefixTone ? (
                        <span
                          className="px-1.5 py-0.5 rounded-full border text-[10px] tracking-[0.2em] uppercase"
                          style={{
                            color: prefixTone,
                            borderColor: `${prefixTone}33`,
                            background: `${prefixTone}10`,
                          }}
                        >
                          {typedPrefix}
                        </span>
                      ) : null}
                      <span>{prefixLen > 0 && prefixTone ? (typed.length > prefixLen ? typedRest : typed.slice(prefixLen)) : typed}</span>
                      <span className="terminal-cursor" />
                    </span>
                  </motion.div>
                );
              }

              const rest = firstSpace > -1 ? full.slice(firstSpace) : '';

              return (
                <motion.div
                  key={`${log.timestamp}-${idx}`}
                  className={`flex gap-2 items-start ${getLogColor(log.type)} border-l-2 pl-2`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <span className="text-neon-cyan/50 flex-shrink-0">[{log.timestamp}]</span>
                  <span className="break-all inline-flex items-start gap-2">
                    {prefix && prefixColor(prefix) ? (
                      <>
                        <span
                          className="px-1.5 py-0.5 rounded-full border text-[10px] tracking-[0.2em] uppercase"
                          style={{
                            color: prefixColor(prefix),
                            borderColor: `${prefixColor(prefix)}33`,
                            background: `${prefixColor(prefix)}10`,
                          }}
                        >
                          {prefix}
                        </span>
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
          <div ref={bottomRef} />
        </AnimatePresence>
      </div>

      <p className="text-xs text-neon-cyan/40 mt-2 text-center font-mono">
        CipherShield / live terminal stream | {logs.length} / 100 logs
      </p>
    </motion.div>
  );
};
