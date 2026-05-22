import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, Lock, Menu, Radio, X } from 'lucide-react';
import { healthCheck } from '../../services/cipherService';
import '../../styles/components/navbar.css';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [connectedOpacity, setConnectedOpacity] = useState(1);
  const navRef = useRef<HTMLElement | null>(null);
  const scrollStateRef = useRef(false);
  const subtleTimerRef = useRef<number | null>(null);

  const menuItems = [
    { label: 'Features', href: '#operations-center', icon: Lock },
    { label: 'Transmission', href: '#transmission-demo', icon: Radio },
    { label: 'About', href: '#about-section', icon: BarChart2 },
  ];

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  useEffect(() => {
    const updateBackdrop = () => {
      const nextScrolled = window.scrollY > 60;

      if (scrollStateRef.current === nextScrolled) {
        return;
      }

      scrollStateRef.current = nextScrolled;

      if (navRef.current) {
        navRef.current.style.background = nextScrolled ? 'rgba(5, 8, 16, 0.82)' : 'transparent';
        navRef.current.style.backdropFilter = nextScrolled ? 'blur(12px)' : 'none';
        navRef.current.style.borderBottom = nextScrolled ? '1px solid rgba(0, 217, 255, 0.12)' : '1px solid transparent';
      }
    };

    updateBackdrop();
    window.addEventListener('scroll', updateBackdrop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackdrop);
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      setBackendStatus('checking');
      try {
        await healthCheck();
        if (!mounted) return;
        setBackendStatus('connected');
        if (subtleTimerRef.current) {
          window.clearTimeout(subtleTimerRef.current);
        }
        subtleTimerRef.current = window.setTimeout(() => setConnectedOpacity(0.4), 3000);
      } catch {
        if (!mounted) return;
        setBackendStatus('disconnected');
        setConnectedOpacity(1);
      }
    };

    void checkHealth();
    const interval = window.setInterval(checkHealth, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      if (subtleTimerRef.current) {
        window.clearTimeout(subtleTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.nav
      ref={navRef}
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-container">
        <motion.button
          type="button"
          className="navbar-logo"
          onClick={() => scrollToSection('#home')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="logo-text">
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
          </span>
        </motion.button>

        <div className="navbar-menu-desktop">
          {menuItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="navbar-link"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.href);
              }}
              whileHover={{ y: -1, color: 'var(--color-blue-neon)' }}
              transition={{ duration: 0.2 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <item.icon size={14} />
                {item.label}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="navbar-status"
          style={{ opacity: backendStatus === 'connected' ? connectedOpacity : 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className={`navbar-status-dot ${backendStatus}`}
            aria-hidden="true"
            style={{
              background: backendStatus === 'connected' ? 'var(--color-green, #4ade80)' : backendStatus === 'disconnected' ? 'var(--color-red, #f87171)' : 'var(--color-cyan, #22d3ee)',
              boxShadow: backendStatus === 'connected' ? '0 0 14px rgba(74, 222, 128, 0.55)' : backendStatus === 'disconnected' ? '0 0 14px rgba(248, 113, 113, 0.55)' : '0 0 14px rgba(34, 211, 238, 0.45)',
            }}
          />
          <span className="navbar-status-text">
            {backendStatus === 'connected' && 'System Online'}
            {backendStatus === 'disconnected' && 'Backend Offline'}
            {backendStatus === 'checking' && 'Connecting...'}
          </span>
        </motion.div>

        <motion.button
          className="navbar-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar-menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="navbar-mobile-link"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.href);
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <item.icon size={14} />
                  {item.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
