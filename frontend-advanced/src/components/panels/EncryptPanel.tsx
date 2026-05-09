import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Lock, Key } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';
import { cipherApi } from '../../api/cipherApi';

export const EncryptPanel: React.FC = () => {
  const {
    plaintext,
    setPlaintext,
    encryptionKey,
    setEncryptionKey,
    setCiphertext,
    loading,
    setLoading,
    addHistory,
    addLog,
  } = useCipherStore();

  const [lastEncryption, setLastEncryption] = useState<{
    nonce: string;
    tag: string;
    ciphertext: string;
  } | null>(null);

  const handleGenerateKey = async () => {
    setLoading(true);
    addLog('Generating new AES-256 encryption key...', 'info');
    try {
      const response = await cipherApi.generateKey();
      setEncryptionKey(response.key);
      addLog('AES-256 key generated successfully', 'success');
    } catch (error) {
      addLog('Failed to generate key', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      addLog('Please enter text to encrypt', 'error');
      return;
    }
    if (!encryptionKey.trim()) {
      addLog('Please generate an encryption key first', 'error');
      return;
    }

    setLoading(true);
    addLog('Encrypting message...', 'info');
    try {
      const response = await cipherApi.encrypt(plaintext, encryptionKey);
      setCiphertext(response.ciphertext);
      setLastEncryption({
        nonce: response.nonce,
        tag: response.tag,
        ciphertext: response.ciphertext,
      });
      addHistory({
        id: Date.now().toString(),
        plaintext,
        ciphertext: response.ciphertext,
        timestamp: new Date().toLocaleString(),
      });
      addLog('Message encrypted successfully', 'success');
    } catch (error: any) {
      addLog(`Encryption failed: ${error.message}`, 'error');
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
      {/* Key Management */}
      <div className="glass-panel p-6 border-l-2 border-neon-cyan/50">
        <h3 className="text-sm font-bold text-neon-cyan/80 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Key size={16} /> Encryption Key
        </h3>
        <motion.button
          onClick={handleGenerateKey}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 text-neon-cyan rounded-lg font-medium hover:border-neon-cyan hover:shadow-neon transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className="inline mr-2" />
          Generate New Key
        </motion.button>
        {encryptionKey && (
          <motion.div
            className="mt-4 p-3 bg-black/50 rounded-lg border border-neon-cyan/20 font-mono text-xs text-neon-cyan/70 break-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-neon-cyan/50 text-xs mb-2">Current Key (AES-256):</div>
            <div className="flex items-center justify-between gap-2">
              <span>{encryptionKey}</span>
              <button
                onClick={() => copyToClipboard(encryptionKey)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Copy size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Plaintext Input */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-neon-cyan/80 mb-4 uppercase tracking-wider">
          Message to Encrypt
        </h3>
        <textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full h-32 bg-black/50 border border-neon-cyan/20 rounded-lg p-4 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none resize-none"
        />
        <div className="mt-2 text-xs text-neon-cyan/50">
          Characters: {plaintext.length}
        </div>
      </div>

      {/* Encrypt Button */}
      <motion.button
        onClick={handleEncrypt}
        disabled={loading || !plaintext.trim() || !encryptionKey.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock size={20} />
        {loading ? 'Encrypting...' : 'Encrypt Message'}
      </motion.button>
    </motion.div>
  );
};
