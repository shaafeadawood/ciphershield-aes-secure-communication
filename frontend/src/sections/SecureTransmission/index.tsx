import React, { useCallback, useState } from 'react';
import { transmissionBus } from '../../utils/transmissionBus';
import type { TransmissionPacket } from '../../types/transmission.types';
import { useCipherStore } from '../../store/cipherStore';
import { SenderPanel } from './SenderPanel';
import { ChannelView } from './ChannelView';
import { ReceiverPanel } from './ReceiverPanel';
import '../../styles/sections/encryption-experience.css';
import { ShieldAlert } from 'lucide-react';
import { encryptMessage, generateKey } from '../../services/cipherService';

export const SecureTransmissionSection: React.FC = () => {
  const addLog = useCipherStore((s) => s.addLog);

  const [transmissionStatus, setTransmissionStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [interceptMode, setInterceptMode] = useState<boolean>(false);
  const [currentPacket, setCurrentPacket] = useState<TransmissionPacket | null>(null);
  const [senderText, setSenderText] = useState<string>('');
  const [decryptedOutput, setDecryptedOutput] = useState<string>('');
  const [interceptedPayload, setInterceptedPayload] = useState<string>('');
  const [sessionKey, setSessionKey] = useState<string>('');

  const scramble = useCallback((ciphertext: string) => {
    const glyphs = '█▓▒░▄▀■□▪▫◆◇○●0123456789ABCDEF';
    let out = '';
    for (let i = 0; i < ciphertext.length; i++) out += glyphs[Math.floor(Math.random() * glyphs.length)];
    return out;
  }, []);

  const handleTransmit = useCallback(async (plaintext: string) => {
    setSenderText(plaintext);
    setTransmissionStatus('sending');
    setInterceptedPayload('');
    setDecryptedOutput('');

    try {
      const { key } = await generateKey();
      setSessionKey(key);

      const { ciphertext } = await encryptMessage(plaintext, key);
      const size = ciphertext.length;
      const packet: TransmissionPacket = {
        id: Date.now().toString(16).slice(-4).toUpperCase(),
        ciphertext,
        size,
        mode: 'AES-256-GCM',
        status: 'dispatched',
        dispatchedAt: Date.now(),
        intercepted: false,
      };

      setCurrentPacket(packet);
      transmissionBus.emit({ type: 'PACKET_DISPATCHED', payload: { id: packet.id, size: packet.size, mode: packet.mode, timestamp: packet.dispatchedAt } });
      addLog(`[SYS] Packet ${packet.id} dispatched · AES-256-GCM · ${packet.size}B`);
      // ChannelView will perform animation and call back on delivery or interception
    } catch (e) {
      addLog('[ERR] Transmission failed');
      setTransmissionStatus('failed');
    }
  }, [addLog, scramble]);

  const handleDelivered = useCallback(() => {
    if (!currentPacket) return;
    transmissionBus.emit({ type: 'PACKET_DELIVERED', payload: { id: currentPacket.id, verified: true, timestamp: Date.now() } });
    addLog(`[OK] Packet ${currentPacket.id} delivered · integrity verified`);
    setDecryptedOutput(senderText);
    setTransmissionStatus('success');
    setCurrentPacket(null);
  }, [addLog, currentPacket, senderText]);

  const handleIntercepted = useCallback((attackType: 'MITM_ATTEMPT' | 'REPLAY_ATTACK' | 'KEY_PROBE') => {
    if (!currentPacket) return;
    transmissionBus.emit({ type: 'INTERCEPTION_ATTEMPT', payload: { id: currentPacket.id, attackType } });
    addLog(`[WARN] Interception attempt · ${attackType}`);
    addLog(`[ERR] Packet ${currentPacket.id} contents unreadable to attacker`);
    addLog(`[OK] Cipher integrity preserved — AES-256-GCM authenticated`);
    setInterceptedPayload(scramble(currentPacket.ciphertext));
    setTransmissionStatus('failed');
    // don't null currentPacket here; let ChannelView finish arrival then parent can clear
  }, [addLog, currentPacket, scramble]);

  const simulateToggle = useCallback(() => setInterceptMode((s) => !s), []);

  return (
    <section id="transmission-demo" className="control-center-section">
      <div className="container control-center-shell">
        <div className="text-center mb-8">
          <div className="font-mono text-xs uppercase text-neon-cyan/40 tracking-wider">SECURE CHANNEL PROTOCOL</div>
          <h2 className="control-center-title mt-2">
            <span style={{ color: 'var(--color-primary)' }}>Encrypted</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--color-cyan), var(--color-purple))' }}>Transmission</span>
          </h2>
          <p className="text-neon-cyan/50 max-w-[520px] mx-auto mt-2">Watch AES-256-GCM encryption protect your message in transit. Every packet is sealed before leaving the sender. Interception reveals nothing.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr 1fr', gap: 24, alignItems: 'stretch' }}>
          <SenderPanel onTransmit={handleTransmit} transmissionStatus={transmissionStatus} sessionKey={sessionKey} />
          <ChannelView packet={currentPacket} interceptMode={interceptMode} onDelivered={handleDelivered} onIntercepted={() => {
            // choose random attack
            const attacks: Array<'MITM_ATTEMPT' | 'REPLAY_ATTACK' | 'KEY_PROBE'> = ['MITM_ATTEMPT', 'REPLAY_ATTACK', 'KEY_PROBE'];
            const pick = attacks[Math.floor(Math.random() * attacks.length)];
            handleIntercepted(pick);
          }} />
          <ReceiverPanel decryptedOutput={decryptedOutput} interceptedPayload={interceptedPayload} transmissionStatus={transmissionStatus} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={simulateToggle} className={`px-4 py-2 rounded-full border ${interceptMode ? 'border-neon-red' : 'border-neon-cyan/20'} bg-black/20 flex items-center gap-2`}>
            <ShieldAlert size={14} />
            <span className="font-mono text-sm">Simulate Interception</span>
          </button>

          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="w-3 h-3 rounded-full" style={{ background: transmissionStatus === 'idle' ? 'var(--color-muted, #374151)' : transmissionStatus === 'sending' ? 'var(--color-cyan)' : transmissionStatus === 'success' ? 'var(--color-green)' : 'var(--color-red)' }} />
            <span>
              {transmissionStatus === 'idle' && 'Ready to transmit'}
              {transmissionStatus === 'sending' && 'Transmitting...'}
              {transmissionStatus === 'success' && 'Delivered securely'}
              {transmissionStatus === 'failed' && 'Interception detected'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureTransmissionSection;
