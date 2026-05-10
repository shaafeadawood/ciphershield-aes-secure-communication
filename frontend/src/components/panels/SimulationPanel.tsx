import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { useCipherStore } from '../../store/cipherStore';

export const SimulationPanel: React.FC = () => {
  const { history, loading, setLoading, addLog } = useCipherStore();
  const [attackData, setAttackData] = useState<any>(null);

  const handleSimulateAttack = async () => {
    if (history.length === 0) {
      addLog('Encrypt a message first to simulate attack', 'error');
      return;
    }

    setLoading(true);
    addLog('Simulating network interception...', 'info');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const randomEncryption = history[Math.floor(Math.random() * history.length)];

    const simulatedAttack = {
      timestamp: new Date().toISOString(),
      source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol: 'TCP',
      port: Math.floor(Math.random() * (65535 - 1024)) + 1024,
      packet_size: Math.floor(Math.random() * 1024) + 512,
      ciphertext: randomEncryption.ciphertext,
      encryption_algorithm: 'AES-256-GCM',
      attack_status: 'INTERCEPTED',
      decryption_attempts: 0,
      max_attempts: Math.pow(2, 256), // 2^256 possible keys
      estimated_crack_time: 'Universe lifetime ♾️',
    };

    setAttackData(simulatedAttack);
    addLog('Network packet intercepted successfully', 'info');
    addLog('WARNING: Intercepted data is UNREADABLE without encryption key', 'error');
    setLoading(false);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Intro Card */}
      <div className="glass-panel p-6 border-l-2 border-orange-500/50">
        <h3 className="text-sm font-bold text-orange-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
          <Shield size={16} /> Cyber Attack Simulation
        </h3>
        <p className="text-sm text-neon-cyan/60 mb-4">
          This simulation demonstrates how encryption protects your data even if intercepted over the network.
        </p>
        <motion.button
          onClick={handleSimulateAttack}
          disabled={loading || history.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-400 rounded-lg font-medium hover:border-orange-500 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <AlertTriangle size={16} />
          {loading ? 'Simulating Attack...' : 'Simulate Network Interception'}
        </motion.button>
      </div>

      {/* Attack Details */}
      {attackData && (
        <motion.div
          className="glass-panel p-6 border-l-2 border-red-500/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-red-400/80 mb-4 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} /> Intercepted Packet Data
          </h3>

          {/* Live Threat Indicator */}
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-red-400 font-bold">LIVE THREAT DETECTED</span>
            </div>
            <p className="text-sm text-red-400/80">
              Network packet successfully intercepted. Data is encrypted and unreadable.
            </p>
          </div>

          {/* Packet Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 font-mono text-xs">
            {[
              { label: 'Timestamp', value: attackData.timestamp },
              { label: 'Source IP', value: attackData.source_ip },
              { label: 'Destination IP', value: attackData.destination_ip },
              { label: 'Protocol', value: attackData.protocol },
              { label: 'Port', value: attackData.port },
              { label: 'Packet Size', value: `${attackData.packet_size} bytes` },
              { label: 'Encryption', value: attackData.encryption_algorithm },
              { label: 'Attack Status', value: attackData.attack_status },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-3 bg-black/50 border border-neon-cyan/20 rounded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="text-neon-cyan/60 mb-1">{item.label}</div>
                <div className="text-white break-all">{item.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Ciphertext */}
          <div className="mb-6">
            <label className="text-xs text-neon-cyan/60 mb-2 block font-bold uppercase tracking-wider">
              Intercepted Ciphertext (Encrypted)
            </label>
            <div className="p-4 bg-black/50 border border-neon-cyan/20 rounded-lg font-mono text-xs text-neon-cyan break-all max-h-24 overflow-y-auto">
              {attackData.ciphertext}
            </div>
          </div>

          {/* Security Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="font-bold text-red-400">Status: INTERCEPTED</span>
              </div>
              <p className="text-xs text-red-400/80">
                Data packet was captured from network traffic
              </p>
            </motion.div>

            <motion.div
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Check size={16} className="text-green-400" />
                <span className="font-bold text-green-400">Security: STRONG</span>
              </div>
              <p className="text-xs text-green-400/80">
                Data is unreadable without correct AES key
              </p>
            </motion.div>
          </div>

          {/* Brute Force Analysis */}
          <motion.div
            className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm font-bold text-purple-400 mb-3">Brute Force Analysis</div>
            <div className="space-y-2 text-xs text-purple-400/80 font-mono">
              <div>
                Possible encryption keys: <span className="text-purple-300">{attackData.max_attempts}</span>
              </div>
              <div>
                Estimated crack time: <span className="text-purple-300">{attackData.estimated_crack_time}</span>
              </div>
              <div className="text-purple-400/60 mt-2">
                Even with world's fastest supercomputer, brute force cracking is mathematically impossible.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Educational Notes */}
      <div className="glass-panel p-4 border-l-2 border-neon-green/50">
        <h4 className="text-xs font-bold text-neon-green/80 mb-2 uppercase tracking-wider">💡 Security Lesson</h4>
        <p className="text-xs text-neon-cyan/60 leading-relaxed">
          Even if attackers intercept encrypted data, they cannot read it without the encryption key. 
          AES-256-GCM provides both confidentiality (encryption) and authentication (integrity verification).
        </p>
      </div>
    </motion.div>
  );
};
