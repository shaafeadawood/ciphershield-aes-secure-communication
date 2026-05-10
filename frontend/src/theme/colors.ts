/**
 * Premium Cybersecurity Color Palette
 * Dark, sophisticated, minimal neon accents
 */

export const colors = {
  // Blacks and Grays
  black: {
    pure: '#000000',
    deep: '#0a0a0a',
    dark: '#0f0f0f',
    charcoal: '#1a1a1a',
  },

  // Dark Blues and Navys
  navy: {
    darkest: '#0d1117',
    dark: '#111927',
    medium: '#1a2332',
    light: '#252e3f',
  },

  // Accent Colors
  blue: {
    neon: '#00d9ff', // Cyan neon
    electric: '#0099ff', // Electric blue
    muted: '#0066cc', // Muted blue
    subtle: '#003d99', // Subtle blue
  },

  // Secondary Accents
  cyan: {
    bright: '#00e5ff',
    normal: '#00d9ff',
    muted: '#0088dd',
  },

  // Neutral text colors
  text: {
    primary: '#ffffff',
    secondary: '#b0b8c1',
    tertiary: '#7a8592',
    muted: '#4a5568',
  },

  // Utility colors
  success: '#00d47e',
  warning: '#ffb800',
  error: '#ff4466',
  info: '#00d9ff',
};

export const gradients = {
  // Hero gradients
  heroBackground: 'linear-gradient(135deg, #0a0a0a 0%, #0f1419 50%, #0a0a0a 100%)',

  // Accent gradients
  accentBlue: 'linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)',
  accentCyan: 'linear-gradient(135deg, #00e5ff 0%, #00d9ff 100%)',

  // Text gradients
  textGlam: 'linear-gradient(90deg, #ffffff 0%, #00d9ff 50%, #0099ff 100%)',
  textSubtle: 'linear-gradient(90deg, #b0b8c1 0%, #00d9ff 100%)',
};

export const shadows = {
  // Glowing shadows for premium feel
  glow: {
    sm: '0 0 8px rgba(0, 217, 255, 0.2)',
    md: '0 0 16px rgba(0, 217, 255, 0.3)',
    lg: '0 0 32px rgba(0, 217, 255, 0.4)',
    xl: '0 0 48px rgba(0, 217, 255, 0.5)',
  },

  // Elevation shadows
  elevation: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 8px 24px rgba(0, 0, 0, 0.4)',
    lg: '0 16px 40px rgba(0, 0, 0, 0.5)',
    xl: '0 24px 56px rgba(0, 0, 0, 0.6)',
  },
};

export const backdropFilters = {
  glass: 'backdrop-blur(10px)',
  glassStrong: 'backdrop-blur(20px)',
  glassMuted: 'backdrop-blur(5px)',
};
