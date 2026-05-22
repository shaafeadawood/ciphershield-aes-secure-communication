import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart2, Binary, History, Layers, Lock, Radar, Shield, Terminal, Unlock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CyberSpace } from '../visualization/CyberSpace';
import { EncryptPanel } from '../panels/EncryptPanel';
import { DecryptPanel } from '../panels/DecryptPanel';
import { HistoryPanel } from '../panels/HistoryPanel';
import { SimulationPanel } from '../panels/SimulationPanel';
import { StrengthAnalyzer } from '../../panels/StrengthAnalyzer';
import { SystemLogs } from '../ui/SystemLogs';
import { staggerContainer, staggerItem, scrollReveal } from '../animations/variants';
import { useCipherStore } from '../../store/cipherStore';
import '../../styles/sections/encryption-experience.css';

const tabConfig = [
  { id: 'encrypt' as const, label: 'Encrypt', icon: Lock },
  { id: 'decrypt' as const, label: 'Decrypt', icon: Unlock },
  { id: 'history' as const, label: 'History', icon: History },
  { id: 'simulation' as const, label: 'Simulation', icon: Radar },
  { id: 'analysis' as const, label: 'Analysis', icon: BarChart2 },
];

export const EncryptionExperience: React.FC = () => {
  const currentTab = useCipherStore((state) => state.currentTab);
  const setCurrentTab = useCipherStore((state) => state.setCurrentTab);
  const resetSession = useCipherStore((state) => state.resetSession);
  const clearLogs = useCipherStore((state) => state.clearLogs);
  const clearHistory = useCipherStore((state) => state.clearHistory);
  const history = useCipherStore((state) => state.history);
  const logs = useCipherStore((state) => state.logs);
  const encryptionKey = useCipherStore((state) => state.encryptionKey);
  const ciphertext = useCipherStore((state) => state.ciphertext);
  const plaintext = useCipherStore((state) => state.plaintext);
  const decrypted = useCipherStore((state) => state.decrypted);

  const tabPanel = () => {
    switch (currentTab) {
      case 'decrypt':
        return <DecryptPanel />;
      case 'analysis':
        return <StrengthAnalyzer />;
      case 'history':
        return <HistoryPanel />;
      case 'simulation':
        return <SimulationPanel />;
      case 'encrypt':
      default:
        return <EncryptPanel />;
    }
  };

  return (
    <section id="encryption" className="control-center-section">
      <div className="control-center-background">
        <CyberSpace isActive />
      </div>
      <div className="control-center-vignette" />

      <div className="container control-center-shell">
        <motion.div
          className="control-center-header"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="control-center-kicker" variants={staggerItem}>
            <Activity size={14} /> Live security operations
          </motion.div>

          <motion.h2 className="control-center-title" variants={staggerItem}>
            CipherShield Operations Center
          </motion.h2>

          <motion.p className="control-center-subtitle" variants={staggerItem}>
            Encrypt, decrypt, audit history, and simulate interception inside one connected cybersecurity workspace.
          </motion.p>

          <motion.div className="control-center-meta" variants={staggerItem}>
            <span className="status-chip"><Shield size={12} /> AES-256-GCM</span>
            <span className="status-chip"><Binary size={12} /> Caesar comparison</span>
            <span className="status-chip"><Terminal size={12} /> Live logs</span>
            <span className="status-chip"><Layers size={12} /> 3D ambient depth</span>
          </motion.div>

          <motion.div className="control-center-actions" variants={staggerItem}>
            <Button variant="primary" size="md" onClick={() => setCurrentTab('encrypt')}>
              Open Encrypt
            </Button>
            <Button variant="secondary" size="md" onClick={() => setCurrentTab('simulation')}>
              Open Simulation
            </Button>
            <Button variant="outline" size="md" onClick={resetSession}>
              Reset Session
            </Button>
          </motion.div>
        </motion.div>

        <div className="control-center-grid">
          <motion.div
            className="control-center-main"
            {...scrollReveal}
          >
            <div className="control-center-tabs">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCurrentTab(tab.id)}
                    className={`control-tab ${isActive ? 'control-tab-active' : ''}`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                className="control-panel-surface"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28 }}
              >
                {tabPanel()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.aside
            className="control-center-sidebar"
            {...scrollReveal}
          >
            <Card className="control-center-summary" glowEffect={true}>
              <div className="summary-header">
                <div>
                  <div className="summary-label">Session overview</div>
                  <h3 className="summary-title">Connected security stack</h3>
                </div>
                <span className="summary-badge">Online</span>
              </div>

              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-item-label">Encrypted</span>
                  <span className="summary-item-value">{ciphertext ? 'Ready' : 'Idle'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">Plaintext</span>
                  <span className="summary-item-value">{plaintext.length} chars</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">History</span>
                  <span className="summary-item-value">{history.length} items</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">Logs</span>
                  <span className="summary-item-value">{logs.length} entries</span>
                </div>
              </div>

              <div className="summary-stack">
                <div className="summary-stack-row">
                  <span>Current key</span>
                  <strong>{encryptionKey ? 'Generated' : 'Not generated'}</strong>
                </div>
                <div className="summary-stack-row">
                  <span>Last decrypted</span>
                  <strong>{decrypted ? 'Available' : 'Pending'}</strong>
                </div>
              </div>

              <div className="summary-actions">
                <button type="button" onClick={() => setCurrentTab('history')}>
                  Review history
                </button>
                <button type="button" onClick={() => setCurrentTab('decrypt')}>
                  Open decrypt
                </button>
                <button type="button" onClick={clearHistory}>
                  Clear history
                </button>
                <button type="button" onClick={clearLogs}>
                  Clear logs
                </button>
              </div>
            </Card>

            <SystemLogs />
          </motion.aside>
        </div>
      </div>
    </section>
  );
};
