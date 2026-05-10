import React from 'react';
import { motion } from 'framer-motion';
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
        {/* Main Footer */}
        <div className="footer-main">
          <div className="footer-column">
            <h4 className="footer-title">CipherShield</h4>
            <p className="footer-description">
              Advanced secure communication using AES-256-GCM cryptography. Premium, cinematic encryption experience.
            </p>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Product</h5>
            <ul className="footer-links">
              <li><a href="#encryption">Encryption</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#documentation">Documentation</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Company</h5>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Connect</h5>
            <ul className="footer-links">
              <li><a href="#github">GitHub</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} CipherShield. All rights reserved. Zero-knowledge encryption. Client-side processing.
          </p>
          <div className="footer-badges">
            <span className="badge">AES-256-GCM</span>
            <span className="badge">Zero-Knowledge</span>
            <span className="badge">Open Source</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
