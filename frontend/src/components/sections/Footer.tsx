import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { fadeInUp } from '../animations/variants';
import '../../styles/sections/footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <motion.div
        className="footer-content"
        {...fadeInUp}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-main">
          <div className="footer-column">
            <h4 className="footer-title">
              <span style={{ color: 'var(--color-text-primary)' }}>Cipher</span>
              <span
                style={{
                  background: 'linear-gradient(90deg, var(--color-blue-neon) 0%, var(--color-blue-electric) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Shield
              </span>
            </h4>
            <p className="footer-description">
              AES-256-GCM encrypted communication with a cinematic interface, typed service layer, and backend health monitoring.
            </p>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Product</h5>
            <ul className="footer-links">
              <li><a href="#operations-center">Operations Center</a></li>
              <li><a href="#transmission-demo">Transmission Demo</a></li>
              <li><a href="#about-section">About</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Backend</h5>
            <ul className="footer-links">
              <li><a href="http://localhost:8000/api/health" target="_blank" rel="noreferrer">API Health</a></li>
              <li><a href="http://localhost:8000/api/cipher/generate-key" target="_blank" rel="noreferrer">Generate Key</a></li>
              <li><a href="http://localhost:8000/api/cipher/encrypt" target="_blank" rel="noreferrer">Encrypt Route</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Connect</h5>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="premium-button button-secondary button-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Github size={16} /> GitHub
            </motion.a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} CipherShield. AES-256-GCM secure transmission, client-side analysis, backend-assisted payload generation.
          </p>
          <div className="footer-badges">
            <span className="badge">AES-256-GCM</span>
            <span className="badge">TypeScript</span>
            <span className="badge">FastAPI</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
