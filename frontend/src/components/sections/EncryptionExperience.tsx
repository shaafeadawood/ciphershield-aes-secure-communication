import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollReveal, staggerContainer, staggerItem } from '../animations/variants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApi } from '../../hooks/useApi';
import '../../styles/sections/encryption-experience.css';

export const EncryptionExperience: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [encryptedData, setEncryptedData] = useState<{
    key: string;
    ciphertext: string;
    nonce: string;
    tag: string;
  } | null>(null);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);
  const { encryptData, decryptData, generateKey } = useApi();

  const handleEncrypt = async () => {
    if (!plaintext.trim()) return;
    setLoading(true);
    try {
      const key = await generateKey();
      const result = await encryptData(plaintext, key);
      setEncryptedData(result);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedData) return;
    setLoading(true);
    try {
      const result = await decryptData(
        encryptedData.ciphertext,
        encryptedData.key,
        encryptedData.nonce,
        encryptedData.tag
      );
      setPlaintext(result);
      setMode('encrypt');
      setEncryptedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="encryption-experience-section">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          {...scrollReveal}
        >
          <h2 className="section-title">Live Encryption</h2>
          <p className="section-subtitle">Experience real-time AES-256-GCM encryption with visual transformation</p>
        </motion.div>

        {/* Main Experience */}
        <motion.div
          className="experience-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Input Section */}
          <motion.div
            className="experience-input"
            variants={staggerItem}
          >
            <Card className="input-card">
              <div className="card-label">Secure Message</div>
              <textarea
                className="input-field"
                placeholder="Enter your message to encrypt..."
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                disabled={loading}
              />
              <div className="input-meta">
                <span className="char-count">{plaintext.length} characters</span>
                <span className={`security-badge ${plaintext.length > 0 ? 'active' : ''}`}>
                  {plaintext.length > 0 ? '🔒 Ready' : '🔓 Empty'}
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleEncrypt}
                disabled={!plaintext.trim() || loading}
                className="encrypt-button"
              >
                {loading ? 'Encrypting...' : 'Encrypt Message'}
              </Button>
            </Card>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="experience-divider"
            variants={staggerItem}
          >
            <div className="divider-line"></div>
            <div className="divider-icon">⇄</div>
            <div className="divider-line"></div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            className="experience-output"
            variants={staggerItem}
          >
            <Card className="output-card">
              <div className="card-label">Encrypted Output</div>

              <AnimatePresence mode="wait">
                {encryptedData ? (
                  <motion.div
                    key="encrypted"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="encrypted-display"
                  >
                    {/* Ciphertext */}
                    <div className="encryption-block">
                      <label className="block-label">Ciphertext</label>
                      <div className="encryption-value monospace">
                        {encryptedData.ciphertext.substring(0, 64)}...
                      </div>
                      <button
                        className="copy-button"
                        onClick={() => navigator.clipboard.writeText(encryptedData.ciphertext)}
                      >
                        Copy
                      </button>
                    </div>

                    {/* Nonce */}
                    <div className="encryption-block">
                      <label className="block-label">Nonce</label>
                      <div className="encryption-value monospace">
                        {encryptedData.nonce}
                      </div>
                    </div>

                    {/* Tag */}
                    <div className="encryption-block">
                      <label className="block-label">Auth Tag</label>
                      <div className="encryption-value monospace">
                        {encryptedData.tag}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleDecrypt}
                      disabled={loading}
                      className="decrypt-button"
                    >
                      {loading ? 'Decrypting...' : 'Decrypt Message'}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="empty-state"
                  >
                    <div className="empty-icon">🔐</div>
                    <p className="empty-text">Encrypted data will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="encryption-info"
          {...scrollReveal}
        >
          <div className="info-grid">
            <div className="info-card">
              <h3 className="info-title">AES-256-GCM</h3>
              <p className="info-text">Military-grade encryption with authenticated encryption with associated data (AEAD)</p>
            </div>
            <div className="info-card">
              <h3 className="info-title">Real-time Processing</h3>
              <p className="info-text">Instant encryption and decryption with zero data storage or transmission to external servers</p>
            </div>
            <div className="info-card">
              <h3 className="info-title">Secure Transmission</h3>
              <p className="info-text">Share encrypted data with the authentication tag to ensure integrity and authenticity</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
