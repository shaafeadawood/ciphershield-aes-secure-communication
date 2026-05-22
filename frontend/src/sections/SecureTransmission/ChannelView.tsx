import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TransmissionPacket } from '../../types/transmission.types';

export interface ChannelViewProps {
  packet: TransmissionPacket | null;
  interceptMode: boolean;
  onDelivered: () => void;
  onIntercepted: () => void;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export const ChannelView: React.FC<ChannelViewProps> = ({ packet, interceptMode, onDelivered, onIntercepted }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const packetRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const interceptedFired = useRef<boolean>(false);
  const [burstKey, setBurstKey] = useState<number | null>(null);
  const [deliveredCount, setDeliveredCount] = useState<number>(0);
  const [hexDump, setHexDump] = useState<string[]>([]);

  useEffect(() => {
    if (!packet) {
      setHexDump(['-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --', '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --', '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --']);
      return;
    }

    // update hex dump
    const ct = packet.ciphertext.replace(/\s+/g, '').toUpperCase();
    const pairs = ct.match(/.{1,2}/g) || [];
    const rows: string[] = [];
    for (let r = 0; r < 3; r++) rows.push(pairs.slice(r * 16, r * 16 + 16).join(' ') || '-- '.repeat(16));
    setHexDump(rows);

    const duration = 1800;
    interceptedFired.current = false;
    startRef.current = null;

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOut(t);

      // position packet
      const track = trackRef.current;
      const pkt = packetRef.current;
      if (track && pkt) {
        const trackRect = track.getBoundingClientRect();
        const maxLeft = trackRect.width - 60; // account for packet width
        const left = Math.round(eased * maxLeft);
        pkt.style.left = `${left}px`;
      }

      // interception trigger at 0.48
      if (!interceptedFired.current && t >= 0.48) {
        interceptedFired.current = true;
        if (interceptMode) {
          setBurstKey(Date.now());
          onIntercepted();
        }
      }

      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else {
        // arrival
        // fade out then call onDelivered or handle intercepted appearance
        setTimeout(() => {
          setDeliveredCount((c) => c + 1);
          onDelivered();
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [packet, interceptMode, onDelivered, onIntercepted]);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="glass-panel p-6" style={{ position: 'relative' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="font-mono text-xs text-neon-cyan/40 uppercase">ENCRYPTED CHANNEL</div>
        <div className="font-mono text-xs text-neon-cyan/40">{deliveredCount} packets transmitted</div>
      </div>

      <div ref={trackRef} style={{ position: 'relative', height: 180, background: 'rgba(0,0,0,0.35)', borderRadius: 8, overflow: 'hidden' }}>
        {/* ambient cipher rows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)' }} />

        {/* endpoints */}
        <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--color-cyan)', color: 'var(--color-cyan)', fontSize: 12 }}>SND</div>
        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--color-green)', color: 'var(--color-green)', fontSize: 12 }}>RCV</div>

        <AnimatePresence>
          {packet && (
            <div ref={packetRef} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}>
              <div style={{ width: 48, height: 28, borderRadius: 6, border: '1px solid rgba(0,255,255,0.2)', background: 'rgba(0,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 10, color: 'var(--color-cyan)' }}>{packet.id}</div>
            </div>
          )}
        </AnimatePresence>

        {/* interception burst */}
        <AnimatePresence>
          {burstKey && (
            <motion.div key={burstKey} initial={{ width: 0, height: 0, opacity: 1, left: 0 }} animate={{ width: 70, height: 70, opacity: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: 'calc(50% - 35px)', left: '50%', borderRadius: '50%', border: '2px solid var(--color-red)', transform: 'translateX(-50%)' }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 font-mono text-xs text-neon-cyan/40">
        {hexDump.map((row, i) => (
          <div key={i} className="truncate">{row}</div>
        ))}
      </div>
    </div>
  );
};

export default ChannelView;
