import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Copy, Loader2, RefreshCw, Lock, Key, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';
import { encryptMessage, generateKey } from '../../services/cipherService';

export const EncryptPanel: React.FC = () => {
  const {
    plaintext,
    setPlaintext,
    encryptionKey,
    setEncryptionKey,
    setCiphertext,
    setNonce,
    setTag,
    setCurrentTab,
    ciphertext,
    nonce,
    tag,
    loading,
    setLoading,
    addHistory,
    addLog,
  } = useCipherStore();

  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const caesarTransform = (value: string, shift = 3) => {
    return value.replace(/[a-z]/gi, (character) => {
      const baseCode = character === character.toUpperCase() ? 65 : 97;
      return String.fromCharCode(((character.charCodeAt(0) - baseCode + shift) % 26) + baseCode);
    });
  };

  const caesarPreview = plaintext ? caesarTransform(plaintext) : '';
  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    setLoading(true);
    setErrorMessage('');
    addLog('[SYS] Generating new AES-256 encryption key...', 'info');
    try {
      const response = await generateKey();
      setEncryptionKey(response.key);
      addLog('[OK] AES-256 key generated successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const nextMessage = `[ERR] Failed to generate key — ${message}`;
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
    } finally {
      setIsGeneratingKey(false);
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      const nextMessage = '[ERR] Please enter text to encrypt';
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
      return;
    }
    if (!encryptionKey.trim()) {
      const nextMessage = '[ERR] Please generate an encryption key first';
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
      return;
    }

    setIsEncrypting(true);
    setLoading(true);
    setErrorMessage('');
    addLog('[SYS] Encrypting message...', 'info');
    try {
      const response = await encryptMessage(plaintext, encryptionKey);
      setCiphertext(response.ciphertext);
      setNonce(response.nonce);
      setTag(response.tag);
      addHistory({
        id: Date.now().toString(),
        plaintext,
        ciphertext: response.ciphertext,
        timestamp: new Date().toLocaleString(),
        mode: 'AES-256-GCM',
        nonce: response.nonce,
        tag: response.tag,
      });
      addLog('[OK] Message encrypted successfully', 'success');
      addLog('[SYS] Ciphertext, nonce, and authentication tag captured for the session', 'info');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const nextMessage = `[ERR] Encryption failed — ${message}`;
      setErrorMessage(nextMessage);
      addLog(nextMessage, 'error');
    } finally {
      setIsEncrypting(false);
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
          <h3 className="text-sm font-bold text-neon-cyan/80 flex items-center gap-2 uppercase tracking-wider">
            <Key size={16} /> Encryption Key
          </h3>
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neon-cyan/40">
            Session AES Workspace
          </span>
        </div>

        <motion.button
          onClick={handleGenerateKey}
          disabled={loading || isGeneratingKey || isEncrypting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 text-neon-cyan rounded-lg font-medium hover:border-neon-cyan hover:shadow-neon transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGeneratingKey ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {isGeneratingKey ? 'Generating...' : 'Generate New Key'}
        </motion.button>

        {encryptionKey && (
          <motion.div
            className="mt-4 p-3 bg-black/50 rounded-lg border border-neon-cyan/20 font-mono text-xs text-neon-cyan/70 break-all"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-neon-cyan/50 text-xs mb-2">Current Key</div>
            <div className="flex items-start justify-between gap-3">
              <span>{encryptionKey}</span>
              <button
                onClick={() => copyToClipboard(encryptionKey)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Copy key"
              >
                <Copy size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="glass-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 uppercase tracking-wider">
            Message to Encrypt
          </h3>
          <div className="text-xs text-neon-cyan/50 font-mono">
            {plaintext.length} characters
          </div>
        </div>

        <textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter your message here"
          className="w-full h-32 bg-black/50 border border-neon-cyan/20 rounded-lg p-4 text-white placeholder-neon-cyan/30 font-mono text-sm focus:border-neon-cyan focus:outline-none resize-none"
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-black/30 rounded-lg border border-neon-cyan/10">
            <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.25em] text-neon-cyan/60">
              <ShieldCheck size={14} /> AES-256-GCM Preview
            </div>
            <p className="text-sm text-neon-cyan/80 leading-relaxed">
              The message will be encrypted locally through the backend using authenticated encryption.
            </p>
          </div>

          <div className="p-4 bg-black/30 rounded-lg border border-neon-cyan/10">
            <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.25em] text-neon-cyan/60">
              <FileText size={14} /> Caesar Comparison
            </div>
            <p className="text-sm text-neon-cyan/80 leading-relaxed break-words font-mono">
              {caesarPreview || 'Type text to preview a Caesar shift comparison.'}
            </p>
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleEncrypt}
        disabled={loading || isGeneratingKey || isEncrypting || !plaintext.trim() || !encryptionKey.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isEncrypting ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
        {isEncrypting ? 'Encrypting...' : 'Encrypt Message'}
      </motion.button>

      <AnimatePresence mode="wait">
        {ciphertext && (
          <motion.div
            key={ciphertext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass-panel p-6 border-l-2 border-neon-green/50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-neon-green/80 uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight size={16} /> Encrypted Output
                </h3>
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neon-green/50">
                  Session captured
                </span>
              </div>

              <div className="p-4 bg-black/70 rounded-lg border border-neon-green/20 font-mono text-xs text-neon-green break-all whitespace-pre-wrap leading-6">
                {ciphertext.match(/.{1,24}/g)?.join(' ') ?? ciphertext}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-black/40 rounded-lg border border-neon-green/10">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-neon-green/50 mb-2">Nonce</div>
                  <div className="flex items-start justify-between gap-3 font-mono text-xs text-white break-all">
                    <span>{nonce}</span>
                    <button onClick={() => copyToClipboard(nonce)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Copy nonce">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-lg border border-neon-green/10">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-neon-green/50 mb-2">Auth Tag</div>
                  <div className="flex items-start justify-between gap-3 font-mono text-xs text-white break-all">
                    <span>{tag}</span>
                    <button onClick={() => copyToClipboard(tag)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Copy tag">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => copyToClipboard(ciphertext)}
                  className="px-4 py-2 rounded-lg border border-neon-green/30 text-neon-green text-sm hover:bg-neon-green/10 transition-colors"
                >
                  Copy Ciphertext
                </button>
                <button
                  onClick={() => setCurrentTab('decrypt')}
                  className="px-4 py-2 rounded-lg border border-neon-cyan/30 text-neon-cyan text-sm hover:bg-neon-cyan/10 transition-colors"
                >
                  Open Decrypt Panel
                </button>
              </div>

              <div className="mt-4 border-t border-neon-green/10 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowTechnicalDetails((current) => !current)}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neon-green/70"
                >
                  <motion.span animate={{ rotate: showTechnicalDetails ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                  Technical Details
                </motion.button>

                <AnimatePresence>
                  {showTechnicalDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="p-3 bg-black/40 rounded-lg border border-neon-green/10">
                          <div className="text-[11px] uppercase tracking-[0.25em] text-neon-green/50 mb-2">Nonce</div>
                          <div className="font-mono text-xs text-white break-all">{nonce || 'Not captured yet'}</div>
                        </div>

                        <div className="p-3 bg-black/40 rounded-lg border border-neon-green/10">
                          <div className="text-[11px] uppercase tracking-[0.25em] text-neon-green/50 mb-2">Auth Tag</div>
                          <div className="font-mono text-xs text-white break-all">{tag || 'Not captured yet'}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
