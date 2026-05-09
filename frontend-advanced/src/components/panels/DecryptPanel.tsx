import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Unlock } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';
import { cipherApi } from '../../api/cipherApi';

export const DecryptPanel: React.FC = () => {
  const {
    ciphertext,
    setCiphertext,
    decrypted,
    setDecrypted,
    encryptionKey,
    loading,
    setLoading,
    addLog,
  } = useCipherStore();

  const [nonce, setNonce] = useState('');
  const [tag, setTag] = useState('');

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
      {/* Nonce & Tag Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
            Nonce (Base64)
          </label>
          <input
            type="text"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Enter nonce..."
            className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none"
          />
        </div>
        <div className="glass-panel p-4">
          <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
            Tag (Base64)
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag..."
            className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Ciphertext Input */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-neon-cyan/80 mb-4 uppercase tracking-wider">
          Encrypted Message
        </h3>
        <textarea
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Enter encrypted message here..."
          className="w-full h-32 bg-black/50 border border-neon-cyan/20 rounded-lg p-4 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none resize-none"
        />
      </div>

      {/* Decrypt Button */}
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

      {/* Decrypted Output */}
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
