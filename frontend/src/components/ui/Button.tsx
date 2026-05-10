import React from 'react';
import { motion } from 'framer-motion';
import { magneticHover } from '../animations/variants';
import '../../styles/components/button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  return (
    <motion.button
      className={`premium-button button-${variant} button-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...magneticHover}
      whileHover={!disabled ? magneticHover.whileHover : {}}
      whileTap={!disabled ? magneticHover.whileTap : {}}
    >
      <span className="button-content">{children}</span>
      <span className="button-glow"></span>
    </motion.button>
  );
};
