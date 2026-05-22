import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, CheckCircle, ShieldAlert } from 'lucide-react';

export interface ReceiverPanelProps {
  decryptedOutput: string;
  interceptedPayload: string;
  transmissionStatus: 'idle' | 'sending' | 'success' | 'failed';
}

export const ReceiverPanel: React.FC<ReceiverPanelProps> = ({ decryptedOutput, interceptedPayload, transmissionStatus }) => {
  const [revealed, setRevealed] = useState<string>('');

  useEffect(() => {
    let interval: number | null = null;
    setRevealed('');
    if (decryptedOutput) {
      let i = 0;
      interval = window.setInterval(() => {
        i++;
        setRevealed(decryptedOutput.slice(0, i));
        if (i >= decryptedOutput.length && interval) {
          window.clearInterval(interval);
          interval = null;
        }
      }, 28);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [decryptedOutput]);

  return (
    <motion.div className="glass-panel p-6 border-r-2 border-neon-green/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">
          <Server size={16} /> Receiver Node
        </div>
        <div className="w-3 h-3 rounded-full" style={{ background: transmissionStatus === 'success' ? 'var(--color-green)' : transmissionStatus === 'failed' ? 'var(--color-red)' : 'var(--color-muted)' }} />
      </div>

      <hr className="mb-3 border-neon-cyan/6" />

      <div>
        <div className="text-xs text-neon-cyan/40 mb-2">Decrypted output</div>

        <div className="p-3 bg-black/70 rounded-lg border border-neon-green/10 font-mono text-sm text-white min-h-[80px]">
          <AnimatePresence>
            {decryptedOutput && !interceptedPayload && (
              <motion.div key={decryptedOutput} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div>{revealed}<span className="blink">{revealed.length < decryptedOutput.length ? '|' : ''}</span></div>
              </motion.div>
            )}

            {interceptedPayload && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ color: 'var(--color-red)' }}>{interceptedPayload}</div>
              </motion.div>
            )}

            {!decryptedOutput && !interceptedPayload && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center justify-center py-6 text-neon-cyan/40">
                  <Server size={24} />
                  <div className="mt-2">Awaiting encrypted packet</div>
                  <div className="text-xs mt-1">Decryption occurs automatically on verified delivery</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {decryptedOutput && !interceptedPayload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-sm">
            <div className="px-2 py-1 rounded-full bg-neon-green/10 text-neon-green"><CheckCircle size={12} /></div>
            <div>Message integrity verified</div>
          </motion.div>
        )}

        {interceptedPayload && (
          <motion.div initial={{ x: 0 }} animate={{ x: [0, -4, 4, -4, 4, 0] }} transition={{ duration: 0.4 }} className="flex items-center gap-3 text-sm text-neon-red">
            <div className="px-2 py-1 rounded-full bg-neon-red/10 text-neon-red"><ShieldAlert size={12} /></div>
            <div>Integrity check failed — Contents unreadable without key</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReceiverPanel;
