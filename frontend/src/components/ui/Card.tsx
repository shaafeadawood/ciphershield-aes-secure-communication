import React from 'react';
import { motion } from 'framer-motion';
import { hoverGlow } from '../animations/variants';
import '../../styles/components/card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowEffect = true,
}) => {
  return (
    <motion.div
      className={`premium-card ${glowEffect ? 'with-glow' : ''} ${className}`}
      {...(hoverEffect && hoverGlow)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};
