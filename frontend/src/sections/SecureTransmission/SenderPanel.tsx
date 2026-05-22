import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Lock } from 'lucide-react';
import { fadeInUp } from '../../components/animations/variants';

export interface SenderPanelProps {
  onTransmit: (plaintext: string) => void;
  transmissionStatus: 'idle' | 'sending' | 'success' | 'failed';
  sessionKey: string;
}

export const SenderPanel: React.FC<SenderPanelProps> = ({ onTransmit, transmissionStatus, sessionKey }) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // clamp length
    if (value.length > 256) setValue(value.slice(0, 256));
  }, [value]);

  return (
    <motion.div className="glass-panel p-6 border-l-2 border-neon-cyan/50" variants={fadeInUp} initial="initial" animate="animate">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">
          <Send size={16} /> Sender Node
        </div>
        <div className="w-3 h-3 rounded-full" style={{ background: transmissionStatus === 'sending' ? 'var(--color-cyan)' : 'var(--color-muted)' }} />
      </div>

      <hr className="mb-3 border-neon-cyan/6" />

      <div className="mb-3">
        <div className="text-xs text-neon-cyan/40 mb-2">Plaintext message</div>
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} placeholder="Enter message to transmit..." className="w-full bg-black/50 border border-neon-cyan/20 rounded-lg p-3 font-mono text-sm text-white resize-none" maxLength={256} />
        <div className="text-right text-xs font-mono text-neon-cyan/40 mt-1">{value.length} / 256</div>
      </div>

      <div className="mb-4 text-xs text-neon-cyan/40 flex items-center gap-2">
        <Lock size={12} />
        <div>{sessionKey ? `${sessionKey.slice(0, 16)}••••••••` : <em>— awaiting transmission —</em>}</div>
      </div>

      <motion.button onClick={() => onTransmit(value)} disabled={transmissionStatus === 'sending'} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50 flex items-center justify-center gap-2">
        <Send size={14} /> Transmit Encrypted Packet
      </motion.button>

    </motion.div>
  );
};

export default SenderPanel;
