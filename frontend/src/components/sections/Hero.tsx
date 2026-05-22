import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Radio, Shield } from 'lucide-react';
import { staggerContainer, staggerItem } from '../animations/variants';
import '../../styles/sections/hero.css';

interface HeroProps {
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 10,
        y: (e.clientY / window.innerHeight) * 10,
      });
    };

    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    handleScroll();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stats = useMemo(() => [
    { value: 'AES-256-GCM', label: 'Cipher Standard' },
    { value: '2²⁵⁶', label: 'Possible Keys' },
    { value: '< 1ms', label: 'Encryption Speed' },
  ], []);

  const scrollToTarget = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-background">
        <motion.div
          className="hero-accent accent-1"
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <motion.div
          className="hero-accent accent-2"
          animate={{ x: -mousePosition.x, y: -mousePosition.y }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, var(--background-color, #050810) 100%)',
          }}
        />
      </div>

      <motion.div
        className="hero-content"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="hero-badge" variants={staggerItem} transition={{ duration: 0.35, delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <span style={{ flex: 1, height: 1, background: 'rgba(0, 217, 255, 0.2)' }} />
            <span style={{ flex: 1, height: 1, background: 'rgba(0, 217, 255, 0.2)' }} />
          </div>
        </motion.div>

        <motion.div className="hero-title-wrapper" variants={staggerItem} transition={{ duration: 0.45, delay: 0.4 }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            <span style={{ color: 'var(--color-text-primary)' }}>Cipher</span>
            <span
              style={{
                display: 'inline-block',
                marginLeft: '0.12em',
                background: 'linear-gradient(90deg, var(--color-blue-neon) 0%, var(--color-blue-electric) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shield
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className="hero-subtitle"
            style={{ fontWeight: 400, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}
          >
            Secure. Encrypt. Transmit.
          </motion.div>
        </motion.div>

        <motion.p
          className="hero-description"
          variants={staggerItem}
          transition={{ duration: 0.45, delay: 0.6 }}
          style={{ maxWidth: 540, fontSize: 16, lineHeight: 1.75 }}
        >
          AES-256-GCM authenticated encryption with real-time transmission visualization and cryptographic strength analysis. Built for security engineers who demand precision.
        </motion.p>

        <motion.div className="hero-cta" variants={staggerItem} transition={{ duration: 0.35, delay: 0.7 }} style={{ gap: 16 }}>
          <motion.button
            type="button"
            onClick={() => onExploreClick ? onExploreClick() : scrollToTarget('operations-center')}
            className="premium-button button-primary button-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="button-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} /> Launch Operations Center
            </span>
            <span className="button-glow" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => scrollToTarget('transmission-demo')}
            className="premium-button button-secondary button-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="button-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Radio size={16} /> View Transmission Demo
            </span>
            <span className="button-glow" />
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-stats-row"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '28px',
            alignItems: 'center',
            marginTop: 36,
            flexWrap: 'wrap',
          }}
        >
          {stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <motion.div variants={staggerItem} transition={{ duration: 0.35, delay: 0.8 + index * 0.08 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{stat.value}</div>
                <div style={{ marginTop: 3, fontSize: 11, letterSpacing: '0.08em', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{stat.label}</div>
              </motion.div>
              {index < stats.length - 1 && (
                <span style={{ width: 1, height: 32, background: 'rgba(176, 184, 193, 0.18)', alignSelf: 'center' }} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="scroll-indicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{ bottom: 24 }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 6 }}>Explore</div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown className="scroll-icon" size={20} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
