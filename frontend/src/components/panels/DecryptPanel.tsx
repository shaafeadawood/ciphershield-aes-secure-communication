import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Unlock, KeyRound, TimerReset } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';
import { cipherApi } from '../../services/api';

export const DecryptPanel: React.FC = () => {
  const {
    ciphertext,
    setCiphertext,
    decrypted,
    setDecrypted,
    encryptionKey,
    nonce: storedNonce,
    tag: storedTag,
    loading,
    setLoading,
    addLog,
  } = useCipherStore();

  const [nonce, setNonce] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (storedNonce) {
      setNonce(storedNonce);
    }
    if (storedTag) {
      setTag(storedTag);
    }
  }, [storedNonce, storedTag]);

  const handleDecrypt = async () => {
    if (!ciphertext.trim()) {
      addLog('Please enter ciphertext to decrypt', 'error');
      return;
    }
    if (!encryptionKey.trim()) {
      addLog('Please provide encryption key', 'error');
      return;
    }
    if (!nonce.trim() || !tag.trim()) {
      addLog('Nonce and tag are required for decryption', 'error');
      return;
    }

    setLoading(true);
    addLog('Decrypting message...', 'info');
    try {
      const response = await cipherApi.decrypt(ciphertext, encryptionKey, nonce, tag);
      setDecrypted(response.plaintext);
      addLog('Message decrypted successfully', 'success');
    } catch (error: any) {
      setDecrypted('');
      addLog(`Decryption failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied to clipboard', 'success');
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="glass-panel p-6 border-l-2 border-neon-cyan/50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider flex items-center gap-2">
            <KeyRound size={16} /> Decrypt Session Payload
          </h3>
          <button
            onClick={() => {
              setNonce(storedNonce);
              setTag(storedTag);
              addLog('Session payload reloaded into decrypt fields', 'info');
            }}
            className="px-3 py-1.5 text-xs rounded border border-neon-cyan/20 text-neon-cyan/70 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <TimerReset size={12} /> Reload values
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
              Nonce
            </label>
            <input
              type="text"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="Nonce captured from encryption"
              className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
              Authentication Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Tag captured from encryption"
              className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider">
            Encrypted Message
          </h3>
          <div className="text-xs text-neon-cyan/50 font-mono">
            {ciphertext.length} characters
          </div>
        </div>
        <textarea
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Encrypted message appears here after encryption"
          className="w-full h-32 bg-black/50 border border-neon-cyan/20 rounded-lg p-4 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none resize-none"
        />
      </div>

      <motion.button
        onClick={handleDecrypt}
        disabled={loading || !ciphertext.trim() || !nonce.trim() || !tag.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-black font-bold rounded-lg hover:shadow-neon-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Unlock size={20} />
        {loading ? 'Decrypting...' : 'Decrypt Message'}
      </motion.button>

      {decrypted && (
        <motion.div
          className="glass-panel p-6 border-l-2 border-neon-green/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-neon-green/80 mb-4 uppercase tracking-wider">
            Decrypted Message
          </h3>
          <div className="p-4 bg-black/50 rounded-lg border border-neon-green/20 font-mono text-white break-words">
            <div className="flex items-start justify-between gap-2">
              <span>{decrypted}</span>
              <button
                onClick={() => copyToClipboard(decrypted)}
                className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
