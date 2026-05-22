import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Copy, Download, FileCheck, FileText, Loader2, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useCipherStore } from '../store/cipherStore';
import { generateReport } from '../utils/reportGenerator';

export const ReportExport: React.FC = () => {
  const history = useCipherStore((state) => state.history);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [copied, setCopied] = useState(false);

  const reportHtml = useMemo(() => generateReport(history as unknown as Parameters<typeof generateReport>[0]), [history]);

  const avgEntropy = useMemo(() => {
    if (!history.length) return 0;
    const entropy = (text: string) => {
      if (!text) return 0;
      const freq: Record<string, number> = {};
      for (const ch of text) freq[ch] = (freq[ch] || 0) + 1;
      let H = 0;
      const len = text.length;
      for (const k in freq) {
        const p = freq[k] / len;
        H -= p * Math.log2(p);
      }
      return H;
    };
    return history.reduce((sum, item) => sum + entropy(item.ciphertext), 0) / history.length;
  }, [history]);

  const gradeMeta = useMemo(() => {
    if (avgEntropy >= 7.5) return { grade: 'A+', color: 'var(--color-success)' };
    if (avgEntropy >= 7.0) return { grade: 'A', color: 'var(--color-success)' };
    if (avgEntropy >= 6.0) return { grade: 'B', color: 'var(--color-warning)' };
    if (avgEntropy >= 4.0) return { grade: 'C', color: 'var(--color-orange, #fb923c)' };
    return { grade: 'D', color: 'var(--color-error)' };
  }, [avgEntropy]);

  const downloadReport = () => {
    const html = generateReport(useCipherStore.getState().history as unknown as Parameters<typeof generateReport>[0]);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ciphershield-report-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    if (!history.length) return;
    if (reportReady && !previewOpen) {
      setPreviewOpen(true);
      return;
    }
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setPreviewOpen(true);
      setReportReady(true);
    }, 600);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const opsPreview = history.slice(0, 3);
  const extra = Math.max(0, history.length - 3);

  return (
    <div className="space-y-3">
      <motion.button
        type="button"
        onClick={handleGenerate}
        disabled={!history.length || isGenerating}
        className={`w-full ${history.length ? 'premium-button button-secondary button-md' : 'premium-button button-secondary button-md opacity-50 cursor-not-allowed'}`}
        whileHover={history.length && !isGenerating ? { scale: 1.01 } : {}}
        whileTap={history.length && !isGenerating ? { scale: 0.99 } : {}}
      >
        <span className="button-content flex items-center justify-center gap-2">
          {isGenerating ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
          {isGenerating ? 'Compiling session data...' : 'Generate Intelligence Report'}
        </span>
        <span className="button-glow"></span>
      </motion.button>
      {!history.length && (
        <div className="text-[10px] text-neon-cyan/40 font-mono">Encrypt at least one message to generate your session report</div>
      )}
      {reportReady && !previewOpen && history.length > 0 && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-neon-green">
          <span className="w-2 h-2 rounded-full bg-neon-green"></span> Report ready
        </div>
      )}

      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium"><FileCheck size={16} className="text-neon-cyan" /> Session Intelligence Report</div>
                <button type="button" onClick={() => setPreviewOpen(false)} className="p-1 rounded hover:bg-white/10"><X size={14} /></button>
              </div>
              <div className="border-t border-neon-cyan/10"></div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/10 text-xs font-mono">Total operations: {history.length}</div>
                  <div className="px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/10 text-xs font-mono" style={{ color: gradeMeta.color }}>Security grade: {gradeMeta.grade}</div>
                  <div className="px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/10 text-xs font-mono">Avg entropy: {avgEntropy.toFixed(2)} bits/byte</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neon-cyan/60 mb-2">ENCRYPTED OPERATIONS</div>
                  <div className="space-y-1">
                    {opsPreview.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-neon-cyan/10">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="font-mono text-xs text-neon-cyan/40 min-w-[22px]">{String(index + 1).padStart(2, '0')}</div>
                          <div className="text-sm text-white truncate max-w-[32ch]">{item.plaintext.length > 32 ? `${item.plaintext.slice(0, 32)}...` : item.plaintext}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full border border-neon-cyan/20 text-[10px] uppercase tracking-[0.25em] text-neon-cyan/60">{item.mode}</span>
                          <span className="text-[10px] font-mono text-neon-cyan/40">{(() => { const freq: Record<string, number> = {}; for (const ch of item.ciphertext) freq[ch] = (freq[ch] || 0) + 1; let H = 0; const len = item.ciphertext.length; for (const k in freq) { const p = freq[k] / len; H -= p * Math.log2(p); } return H.toFixed(2); })()} b</span>
                        </div>
                      </div>
                    ))}
                    {extra > 0 && <div className="text-center text-xs text-neon-cyan/40 pt-1">+ {extra} more operations</div>}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neon-cyan/60 mb-2">REPORT INCLUDES</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Full ciphertext output','Shannon entropy analysis','Key strength visualization','Brute-force resistance data','NIST compliance notes','Session timeline'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-white"><CheckCircle size={12} className="text-neon-green" /> {item}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 pt-2">
                <div className="text-xs text-neon-cyan/40">Format: Self-contained HTML · Opens in any browser<div className="text-[10px] mt-1">Can be saved as PDF via browser print</div></div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="md" onClick={downloadReport}><Download size={15} /> Download Report</Button>
                  <Button variant="secondary" size="md" onClick={handleCopy}>{copied ? <CheckCircle size={14} /> : <Copy size={14} />} Copy HTML</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportExport;
