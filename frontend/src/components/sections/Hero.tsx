import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem, floating } from '../animations/variants';
import { Button } from '../ui/Button';
import '../../styles/sections/hero.css';

interface HeroProps {
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 10,
        y: (e.clientY / window.innerHeight) * 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section">
      {/* Animated Background */}
      <div className="hero-background">
        <motion.div
          className="hero-accent accent-1"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <motion.div
          className="hero-accent accent-2"
          animate={{
            x: -mousePosition.x,
            y: -mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="hero-content"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Badge */}
        <motion.div
          className="hero-badge"
          variants={staggerItem}
        >
          <span className="badge-text">Advanced Cryptography</span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="hero-title-wrapper"
          variants={staggerItem}
        >
          <h1 className="hero-title">
            <motion.span
              className="title-word"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              CipherShield
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="hero-subtitle"
          variants={staggerItem}
        >
          Advanced Secure Communication using AES-256-GCM Cryptography
        </motion.p>

        {/* Description */}
        <motion.p
          className="hero-description"
          variants={staggerItem}
        >
          Experience military-grade encryption with a cinematic interface. Secure your communication with quantum-resistant AES-256-GCM algorithm, wrapped in a premium, immersive web experience.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-cta"
          variants={staggerItem}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onExploreClick}
          >
            Explore Cipher
          </Button>
          <Button
            variant="secondary"
            size="lg"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Floating Element */}
        <motion.div
          className="hero-floating-element"
          variants={floating}
          animate="animate"
        >
          <div className="floating-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="scroll-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
};
