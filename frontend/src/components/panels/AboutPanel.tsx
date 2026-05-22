import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Zap, BookOpen, Eye, Server } from 'lucide-react';

const features = [
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'AES-256-GCM',
    description: 'Military-grade encryption with 256-bit keys. Virtually unbreakable with current technology.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Authentication',
    description: 'GMAC authentication tags ensure data integrity and authenticity. Prevents tampering attacks.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Real-time Encryption',
    description: 'Instant encryption and decryption with zero latency. Professional-grade performance.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Secure Communication',
    description: 'End-to-end encryption protects your messages from unauthorized access or interception.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: 'Key Management',
    description: 'Advanced key generation and management. Each key is mathematically unique and secure.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Educational Value',
    description: 'Learn cryptography principles while using cutting-edge encryption technology.',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const AboutPanel: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="glass-panel p-8 text-center border-b border-neon-cyan/20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold glow-text mb-3">CipherShield</h2>
          <p className="text-neon-cyan/60 mb-4">Professional Cybersecurity Dashboard v3.0</p>
          <div className="h-1 w-16 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto"></div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="glass-panel p-6 border-l-2 border-neon-cyan/30 hover:border-neon-cyan/80 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className={`mb-3 text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="text-sm font-bold text-neon-cyan/80 mb-2">{feature.title}</h3>
            <p className="text-xs text-neon-cyan/60 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold text-neon-cyan/80 mb-6 uppercase tracking-wider">How It Works</h3>
        
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'Key Generation',
              description: 'Generate a secure AES-256 encryption key using cryptographically secure random number generation.',
            },
            {
              step: 2,
              title: 'Message Encryption',
              description: 'Convert plaintext message into ciphertext using AES-256-GCM algorithm with generated key.',
            },
            {
              step: 3,
              title: 'Secure Transmission',
              description: 'Transmit encrypted data safely. Even if intercepted, data remains unreadable without the key.',
            },
            {
              step: 4,
              title: 'Message Decryption',
              description: 'Recipient uses the same key to decrypt ciphertext back to original plaintext message.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-black">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-neon-cyan/80 mb-1">{item.title}</h4>
                <p className="text-sm text-neon-cyan/60">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-World Applications */}
      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold text-neon-cyan/80 mb-6 uppercase tracking-wider">Real-World Applications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '01', name: 'Banking Systems', desc: 'Secure transaction encryption' },
            { icon: '02', name: 'Messaging Apps', desc: 'WhatsApp, Signal, Telegram use AES' },
            { icon: '03', name: 'Password Managers', desc: 'LastPass, 1Password encryption' },
            { icon: '04', name: 'Cloud Storage', desc: 'Dropbox, Google Drive encryption' },
            { icon: '05', name: 'HTTPS/SSL', desc: 'Secure web communication protocol' },
            { icon: '06', name: 'Government', desc: 'Military and classified data protection' },
          ].map((app, idx) => (
            <motion.div
              key={idx}
              className="p-4 bg-black/50 border border-neon-cyan/20 rounded-lg hover:border-neon-cyan/50 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl mb-2">{app.icon}</div>
              <h4 className="font-bold text-neon-cyan/80 text-sm mb-1">{app.name}</h4>
              <p className="text-xs text-neon-cyan/60">{app.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Key Size', value: '256 bits', icon: 'K1' },
          { label: 'Algorithm', value: 'AES-GCM', icon: 'A2' },
          { label: 'Security', value: 'Military Grade', icon: 'S3' },
          { label: 'Performance', value: 'Real-time', icon: 'P4' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="glass-panel p-4 text-center border-l border-neon-cyan/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xs text-neon-cyan/60 mb-1">{stat.label}</div>
            <div className="font-bold text-neon-cyan/80">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="glass-panel p-6 text-center border-t border-neon-cyan/20">
        <p className="text-xs text-neon-cyan/60 mb-2 font-mono">
          Built with React + Three.js + Framer Motion
        </p>
        <p className="text-xs text-neon-cyan/40">
          © 2026 CipherShield • Advanced Cybersecurity Platform
        </p>
      </div>
    </motion.div>
  );
};
