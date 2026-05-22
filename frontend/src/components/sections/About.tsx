import React from 'react';
import { motion } from 'framer-motion';
import { scrollReveal, staggerContainer, staggerItem } from '../animations/variants';
import '../../styles/sections/about.css';

export const About: React.FC = () => {
  return (
    <section className="about-section" id="about-section">
      <div className="container">
        <motion.div
          className="about-header"
          {...scrollReveal}
        >
          <h2 className="section-title">About CipherShield</h2>
          <p className="section-subtitle">A premium cybersecurity experience designed for the modern era</p>
        </motion.div>

        <motion.div
          className="about-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="about-text"
            variants={staggerItem}
          >
            <h3 className="about-subtitle">Military-Grade Encryption</h3>
            <p className="about-description">
              CipherShield leverages AES-256-GCM (Galois/Counter Mode), the same encryption standard used by government and military institutions worldwide. This authenticated encryption mode ensures both confidentiality and integrity of your messages.
            </p>
          </motion.div>

          <motion.div
            className="about-text"
            variants={staggerItem}
          >
            <h3 className="about-subtitle">Zero-Knowledge Architecture</h3>
            <p className="about-description">
              Your encryption happens entirely in your browser. No messages are transmitted to our servers. No data is stored. Your security keys remain under your complete control. True privacy, verified.
            </p>
          </motion.div>

          <motion.div
            className="about-text"
            variants={staggerItem}
          >
            <h3 className="about-subtitle">Premium Interface</h3>
            <p className="about-description">
              Encryption doesn't have to feel technical or intimidating. CipherShield combines cutting-edge security with a cinematic, intuitive interface that makes advanced cryptography accessible to everyone.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="about-stats"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="stat-card" variants={staggerItem}>
            <div className="stat-number">256-bit</div>
            <div className="stat-label">Encryption Key</div>
          </motion.div>
          <motion.div className="stat-card" variants={staggerItem}>
            <div className="stat-number">100%</div>
            <div className="stat-label">Client-Side</div>
          </motion.div>
          <motion.div className="stat-card" variants={staggerItem}>
            <div className="stat-number">AEAD</div>
            <div className="stat-label">Authenticated</div>
          </motion.div>
          <motion.div className="stat-card" variants={staggerItem}>
            <div className="stat-number">∞</div>
            <div className="stat-label">Zero-Knowledge</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
