import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Cpu, Cloud, Shield, BarChart2 } from 'lucide-react';
import { useCipherStore } from '../store/cipherStore';
import { staggerContainer, staggerItem } from '../components/animations/variants';

// Shannon entropy calculation
const computeShannonEntropy = (input: string): number => {
  if (!input || input.length === 0) return 0;
  const freq = new Map<string, number>();
  for (const ch of input) freq.set(ch, (freq.get(ch) || 0) + 1);
  const len = input.length;
  let H = 0;
  for (const [, count] of freq) {
    const p = count / len;
    H -= p * Math.log2(p);
  }
  return H;
};

const describeArc = (cx: number, cy: number, r: number) => {
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
};

export const StrengthAnalyzer: React.FC = () => {
  const history = useCipherStore((s) => s.history);
  const encryptionKey = useCipherStore((s) => s.encryptionKey);
  const latestCiphertext = history[0]?.ciphertext ?? '';

  const entropy = useMemo(() => computeShannonEntropy(latestCiphertext), [latestCiphertext]);

  // motion values: percent 0..1, spring-animated
  const percent = useMotionValue(0);
  const spring = useSpring(percent, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const normalized = Math.max(0, Math.min(1, entropy / 8));
    percent.set(normalized);
  }, [entropy, percent]);

  // SVG arc geometry
  const width = 320;
  const height = 160;
  const cx = width / 2;
  const cy = height;
  const r = 120;
  const fullArcLength = Math.PI * r; // semicircle length
  const strokeOffset = useTransform(spring, (p) => fullArcLength - p * fullArcLength);

  const score = useMemo(() => Number(entropy.toFixed(2)), [entropy]);

  const arcColor = score >= 7.0 ? 'var(--color-cyan)' : score >= 5.0 ? 'var(--color-amber)' : 'var(--color-red)';

  const verdict =
    score >= 7.5 ? 'Indistinguishable from random' :
    score >= 6.0 ? 'High entropy — strong diffusion' :
    score >= 4.0 ? 'Moderate entropy — review input' :
    'Low entropy — potential weakness';

  // Key visual blocks
  const blocks = new Array(32).fill(0).map((_, i) => i);

  // Brute-force estimates (exponent of 10 years)
  const secondsPerYear = 3.156e7;
  const log10_2 = Math.LOG10E * Math.log(2); // log10(2)
  const computeYearsExp = (keysPerSec: number) => {
    const val = 256 * Math.log10(2) - Math.log10(keysPerSec) - Math.log10(secondsPerYear);
    return Math.floor(val);
  };

  const consumerExp = computeYearsExp(1e12);
  const cloudExp = computeYearsExp(1e18);
  const nationExp = computeYearsExp(1e24);

  return (
    <motion.div className="space-y-6">
      <div className="glass-panel p-6 border-l-2 border-neon-cyan/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neon-cyan/80 flex items-center gap-2 uppercase tracking-wider">
            <BarChart2 size={14} /> Entropy score
          </h3>
        </div>

        {latestCiphertext ? (
          <div className="flex flex-col items-center">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <path
                d={describeArc(cx, cy, r)}
                fill="none"
                stroke="var(--color-muted, #1f2937)"
                strokeWidth={12}
                strokeLinecap="round"
              />

              <motion.path
                d={describeArc(cx, cy, r)}
                fill="none"
                stroke={arcColor}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${fullArcLength} ${fullArcLength}`}
                style={{ strokeDashoffset: strokeOffset }}
              />
            </svg>

            <div className="-mt-16 flex flex-col items-center">
              <div className="text-4xl font-display" style={{ color: 'var(--color-cyan)' }}>{score.toFixed(2)}</div>
              <div className="text-xs text-neon-cyan/40 font-mono">bits / byte</div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={verdict}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28 }}
                  className="mt-3 text-sm"
                >
                  <div>{verdict}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <style>{`@keyframes pulse-ring {0%{opacity:0.3;transform:scale(0.9)}50%{opacity:0.6;transform:scale(1)}100%{opacity:0.3;transform:scale(0.9)}}`}</style>
            <div style={{ position: 'relative', width: 84, height: 84 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.04)', animation: 'pulse-ring 2.5s infinite ease-in-out' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={28} style={{ color: 'var(--color-muted, #9ca3af)' }} />
              </div>
            </div>
            <div className="mt-4 text-sm">Encrypt a message to analyze its strength</div>
            <div className="mt-1 text-xs text-neon-cyan/40">Shannon entropy · key strength · resistance metrics</div>
          </div>
        )}
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono uppercase tracking-wider flex items-center gap-2"><Lock size={13} />256-bit key strength</h4>
          <div className="text-xs font-mono text-neon-cyan/40">2²⁵⁶ possible keys <span className="ml-2 inline-block px-2 py-0.5 bg-neon-green/10 text-neon-green rounded-full text-[11px]">NIST Approved</span></div>
        </div>

        <motion.div
          className="flex gap-1 items-center"
          variants={staggerContainer}
          initial="initial"
          animate={encryptionKey ? 'animate' : 'initial'}
          style={{ flexWrap: 'wrap' }}
        >
          {blocks.map((idx) => (
            <motion.div
              key={idx}
              className="rounded-sm"
              style={{ width: 14, height: 20, borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}
              variants={{
                initial: { opacity: 0.4, background: 'transparent' },
                animate: { opacity: 1, background: 'var(--color-cyan)', transition: { duration: 0.28 } },
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="glass-panel p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h4 className="font-bold">Brute-force resistance</h4>
            <div className="text-xs text-neon-cyan/40">At current computational limits — AES-256-GCM</div>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {[{
            key: 'consumer', icon: Cpu, label: 'Consumer', desc: 'RTX 4090 class GPU', exp: consumerExp, color: 'var(--color-green)'
          }, {
            key: 'cloud', icon: Cloud, label: 'Cloud', desc: '1,000 GPU cluster', exp: cloudExp, color: 'var(--color-cyan)'
          }, {
            key: 'nation', icon: Shield, label: 'Nation', desc: 'Purpose-built ASIC array', exp: nationExp, color: 'var(--color-cyan)'
          }].map((tier, i) => {
            const Icon = tier.icon as any;
            return (
              <motion.div
                key={tier.key}
                className="p-3 mb-3 rounded-lg bg-black/30 border border-neon-cyan/8 flex items-center justify-between"
                variants={staggerItem}
                transition={{ delay: i * 0.12 }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} style={{ color: tier.color }} />
                  <div>
                    <div className="font-bold">{tier.label}</div>
                    <div className="text-xs text-neon-cyan/40">{tier.desc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg" style={{ color: tier.color }}>~10<sup>{tier.exp}</sup> years</div>
                  <div className="px-2 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs">No threat</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StrengthAnalyzer;
