import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Copy, Loader2, Unlock, KeyRound, TimerReset, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';
import { decryptMessage } from '../../services/cipherService';

export const DecryptPanel: React.FC = () => {
  const {
    decrypted,
    setDecrypted,
    encryptionKey,
    nonce: storedNonce,
    tag: storedTag,
    decryptTarget,
    setDecryptTarget,
    setLoading,
    addLog,
  } = useCipherStore();

  const [ciphertextInput, setCiphertextInput] = useState('');
  const [key, setKey] = useState('');
  const [nonce, setNonce] = useState('');
  const [tag, setTag] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [revealed, setRevealed] = useState('');

  useEffect(() => {
    if (decryptTarget) {
      setCiphertextInput(decryptTarget.ciphertext);
      setNonce(decryptTarget.nonce ?? '');
      setTag(decryptTarget.tag ?? '');
      setKey(encryptionKey);
      setDecryptTarget(null);
      return;
    }

    if (storedNonce) {
      setNonce(storedNonce);
    }
    if (storedTag) {
      setTag(storedTag);
    }
  }, [decryptTarget, encryptionKey, setDecryptTarget, storedNonce, storedTag]);

  useEffect(() => {
    setRevealed('');
    if (!decrypted) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setRevealed(decrypted.slice(0, index));

      if (index >= decrypted.length) {
        window.clearInterval(timer);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [decrypted]);

  const handleDecrypt = async () => {
    if (!ciphertextInput.trim()) {
      const nextMessage = '[ERR] Please enter ciphertext to decrypt';
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
      return;
    }
    if (!key.trim()) {
      const nextMessage = '[ERR] Please provide encryption key';
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
      return;
    }
    if (!nonce.trim() || !tag.trim()) {
      const nextMessage = '[ERR] Nonce and tag are required for decryption';
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
      return;
    }

    setIsDecrypting(true);
    setLoading(true);
    setErrorMessage('');
    addLog('[SYS] Decrypting message...', 'info');
    try {
      const response = await decryptMessage(ciphertextInput, key, nonce, tag);
      setDecrypted(response.plaintext);
      addLog('[OK] Message decrypted successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setDecrypted('');
      const nextMessage = `[ERR] Decryption failed — ${message}`;
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
    } finally {
      setIsDecrypting(false);
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
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-mono"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel p-6 border-l-2 border-neon-cyan/50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider flex items-center gap-2">
            <KeyRound size={16} /> Decrypt Session Payload
          </h3>
          <button
            onClick={() => {
              setNonce(storedNonce);
              setTag(storedTag);
              setKey(encryptionKey);
              addLog('[SYS] Session payload reloaded into decrypt fields', 'info');
            }}
            className="px-3 py-1.5 text-xs rounded border border-neon-cyan/20 text-neon-cyan/70 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <TimerReset size={12} /> Reload values
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
              Ciphertext
            </label>
            <textarea
              value={ciphertextInput}
              onChange={(e) => setCiphertextInput(e.target.value)}
              placeholder="Encrypted message appears here after encryption"
              rows={4}
              className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neon-cyan/60 mb-2 uppercase tracking-wider block">
              Encryption Key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Base64 key from Generate Key"
              className="w-full bg-black/50 border border-neon-cyan/20 rounded p-3 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none"
            />
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
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider">
            Decryption Input
          </h3>
          <div className="text-xs text-neon-cyan/50 font-mono">
            {ciphertextInput.length} characters
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleDecrypt}
        disabled={isDecrypting || !ciphertextInput.trim() || !key.trim() || !nonce.trim() || !tag.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-black font-bold rounded-lg hover:shadow-neon-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isDecrypting ? <Loader2 size={20} className="animate-spin" /> : <Unlock size={20} />}
        {isDecrypting ? 'Decrypting...' : 'Decrypt Message'}
      </motion.button>

      <AnimatePresence mode="wait">
        {decrypted ? (
          <motion.div
            key={decrypted}
            className="glass-panel p-6 border-l-2 border-neon-green/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-sm font-bold text-neon-green/80 mb-4 uppercase tracking-wider">
              Decrypted Message
            </h3>
            <div className="p-4 bg-black/50 rounded-lg border border-neon-green/20 font-mono text-white break-words">
              <div className="flex items-start justify-between gap-2">
                <span>{revealed}<span className="terminal-cursor" /></span>
                <button
                  onClick={() => copyToClipboard(decrypted)}
                  className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <motion.div
              className="mt-4 flex flex-wrap gap-2 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <span className="px-2 py-1 rounded-full bg-neon-green/10 text-neon-green flex items-center gap-1"><CheckCircle size={12} /> Message integrity verified</span>
              <span className="px-2 py-1 rounded-full bg-neon-green/10 text-neon-green flex items-center gap-1"><ShieldCheck size={12} /> AES-256-GCM authenticated</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="idle-or-error"
            className="glass-panel p-6 border-l-2 border-neon-green/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {errorMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-300 font-mono text-sm">
                <ShieldAlert size={16} />
                Decryption failed — invalid key or corrupted ciphertext
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-neon-cyan/40">
                <Unlock size={24} />
                <div className="mt-2 text-sm">Awaiting decrypted output</div>
                <div className="text-xs mt-1">Paste a packet or use history quick decrypt</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
