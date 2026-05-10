/**
 * Reusable Framer Motion Animation Configurations
 * Premium, cinematic animation patterns
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, // Custom ease curve
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -10 },
  animate: { opacity: 1, rotate: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// Stagger container for multiple children
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// Hover effects
export const hoverTilt = {
  whileHover: { y: -5, transition: { duration: 0.3 } },
  whileTap: { scale: 0.98 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 24px rgba(0, 217, 255, 0.5)',
    transition: { duration: 0.3 },
  },
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

// Scroll-triggered animations
export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const scrollRevealLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const scrollRevealRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// Floating animation
export const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulse animation
export const pulse = {
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Page transition (full-screen slides)
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

// Shimmer effect on text
export const shimmerText = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 0%'],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

// Magnetic button interaction
export const magneticHover = {
  whileHover: { scale: 1.08 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

// Terminal typing effect
export const typewriterContainer = (delay = 0) => ({
  initial: 'hidden',
  animate: 'visible',
  transition: {
    staggerChildren: 0.05,
    delayChildren: delay,
  },
});

export const typewriterChar = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.05 },
  },
};

// Modal animations
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};
