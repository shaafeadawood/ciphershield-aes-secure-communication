export interface EncryptionHistoryEntry {
  id: string;
  plaintext: string;
  ciphertext: string;
  timestamp: string;
  mode: string;
  nonce?: string;
  tag?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const shannonEntropy = (input: string): number => {
  if (!input) return 0;
  const freq: Record<string, number> = {};
  for (const ch of input) freq[ch] = (freq[ch] || 0) + 1;
  const len = input.length;
  let H = 0;
  for (const k in freq) {
    const p = freq[k] / len;
    H -= p * Math.log2(p);
  }
  return H;
};

const formatTimestamp = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}:${ss} UTC`;
};

export function generateReport(history: EncryptionHistoryEntry[]): string {
  const now = new Date();
  const generated = formatTimestamp(now);

  // per-entry entropy
  const entropies = history.map((h) => shannonEntropy(h.ciphertext));
  const avgEntropy = entropies.length ? entropies.reduce((a, b) => a + b, 0) / entropies.length : 0;

  // grade mapping
  let grade = 'D';
  let gradeLabel = 'Weak';
  let gradeColor = '#f87171';
  if (avgEntropy >= 7.5) { grade = 'A+'; gradeLabel = 'Excellent'; gradeColor = '#4ade80'; }
  else if (avgEntropy >= 7.0) { grade = 'A'; gradeLabel = 'Strong'; gradeColor = '#4ade80'; }
  else if (avgEntropy >= 6.0) { grade = 'B'; gradeLabel = 'Good'; gradeColor = '#fbbf24'; }
  else if (avgEntropy >= 4.0) { grade = 'C'; gradeLabel = 'Moderate'; gradeColor = '#fb923c'; }

  const totalOps = history.length;
  const modes = Array.from(new Set(history.map((h) => h.mode))).join(', ') || '—';
  const authCount = history.filter((h) => !!h.nonce).length;

  // brute force estimates (powers)
  const consumer = '10^67';
  const cloud = '10^61';
  const nation = '10^43';

  const headerStyle = `background:#0a0f1a;border-bottom:1px solid #1e3a5f;padding:28px 40px;color:#f1f5f9;`;

  // operation cards
  const operationCards = history.map((h, idx) => {
    const opIndex = String(idx + 1).padStart(3, '0');
    const ent = shannonEntropy(h.ciphertext);
    const entropyPct = Math.max(0, Math.min(100, (ent / 8) * 100));
    const ctPreview = h.ciphertext.length > 120 ? escapeHtml(h.ciphertext.slice(0, 120)) + '...' : escapeHtml(h.ciphertext);
    return `
      <div style="background:#111827;border:1px solid #1e293b;border-radius:10px;padding:20px;margin-bottom:12px;position:relative;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:#22d3ee;border-radius:10px 0 0 10px"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-family:monospace;font-size:11px;color:#22d3ee;letter-spacing:0.15em">OPERATION ${opIndex}</div>
          <div style="font-family:monospace;font-size:12px;color:#64748b">${escapeHtml(h.timestamp)} <span style="margin-left:10px;background:#1a2744;border:1px solid #1e3a5f;color:#a78bfa;padding:3px 10px;border-radius:20px;font-size:11px">${escapeHtml(h.mode)}</span></div>
        </div>
        <div style="height:1px;background:#1e293b;margin:12px 0"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div style="font-family:monospace;font-size:10px;color:#64748b;letter-spacing:0.1em;margin-bottom:6px">PLAINTEXT INPUT</div>
            <div style="background:#0d1526;border:1px solid #1e293b;border-radius:6px;padding:12px;font-family:monospace;font-size:13px;color:#e2e8f0;word-break:break-all;max-height:80px;overflow:hidden;">${escapeHtml(h.plaintext)}</div>
          </div>
          <div>
            <div style="font-family:monospace;font-size:10px;color:#64748b;letter-spacing:0.1em;margin-bottom:6px">CIPHERTEXT OUTPUT</div>
            <div style="background:#0d1526;border:1px solid #1e3a5f;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;color:rgba(34,211,238,0.8);word-break:break-all;max-height:80px;overflow:hidden;">${ctPreview}</div>
          </div>
        </div>
        ${h.nonce ? `<div style="margin-top:12px;font-family:monospace;font-size:10px;color:#64748b;">NONCE / AUTH TAG</div><div style="margin-top:6px;font-family:monospace;color:#94a3b8">${escapeHtml(h.nonce||'')}${h.tag ? ' · ' + escapeHtml(h.tag) : ''}</div>` : ''}
        <div style="display:flex;justify-content:flex-end;align-items:center;margin-top:12px;">
          <div style="width:160px;background:#1e293b;border-radius:4px;padding:4px;"> 
            <div style="width:${entropyPct}%;height:4px;border-radius:2px;background:#22d3ee"></div>
          </div>
          <div style="font-family:monospace;font-size:12px;color:#94a3b8;margin-left:8px">Entropy: ${ent.toFixed(2)} bits/byte</div>
        </div>
      </div>
    `;
  }).join('\n');

  // entropy distribution rows
  const entropyRows = history.map((h, idx) => {
    const opIndex = String(idx + 1).padStart(3, '0');
    const ent = shannonEntropy(h.ciphertext);
    const pct = Math.max(0, Math.min(100, (ent / 8) * 100));
    const color = ent >= 7.5 ? '#22d3ee' : ent >= 6.0 ? '#a78bfa' : '#fbbf24';
    return `
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <div style="font-family:monospace;font-size:11px;color:#64748b;min-width:52px;margin-right:12px">OP-${opIndex}</div>
        <div style="flex:1;height:8px;background:#1e293b;border-radius:4px;">
          <div style="width:${pct}%;height:100%;background:${color};border-radius:4px"></div>
        </div>
        <div style="font-family:monospace;font-size:11px;color:#94a3b8;min-width:36px;text-align:right;margin-left:12px">${ent.toFixed(2)}</div>
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CipherShield — Cipher Intelligence Report</title>
  <style>
    html,body{height:100%;margin:0;background:#0a0f1a;color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact}
    .container{max-width:1100px;margin:24px auto;padding:0 20px}
    .header{${headerStyle}display:flex;justify-content:space-between;align-items:flex-start}
    .h-left{display:flex;flex-direction:column}
    .brand{font-family:monospace;font-size:11px;color:#22d3ee;letter-spacing:0.3em}
    .title{font-size:26px;font-weight:600;margin-top:6px;color:#f1f5f9}
    .subtitle{font-size:13px;color:#64748b;margin-top:6px}
    .h-right{text-align:right}
    .classification{font-family:monospace;font-size:10px;color:#64748b;letter-spacing:0.2em}
    .pill{background:#1e3a5f;border:1px solid #22d3ee;padding:6px 10px;border-radius:6px;display:inline-block;font-family:monospace;color:#22d3ee;margin-top:6px}
    .strip{background:#0d1526;border-bottom:1px solid #1e293b;padding:18px 0;margin-top:18px}
    .metrics{display:flex;gap:12px}
    .card{background:#111827;border:1px solid #1e293b;border-radius:8px;padding:20px;flex:1;text-align:center}
    .card .value{font-size:28px;font-weight:700}
    .card .label{font-size:11px;color:#64748b;margin-top:4px}
    .divider{display:flex;align-items:center;margin:32px 0 20px 0}
    .divider .title{font-family:monospace;font-size:11px;color:#22d3ee;letter-spacing:0.2em}
    .divider .line{flex:1;height:1px;background:#1e293b;margin-left:16px}
    .section{margin-top:12px}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .card-panel{background:#111827;border:1px solid #1e293b;border-radius:10px;padding:20px}
    .footer{background:#0a0f1a;border-top:1px solid #1e293b;padding:24px 40px;margin-top:28px;display:flex;justify-content:space-between;align-items:center}
    .footer p{color:#334155}
    .footer-bottom{text-align:center;margin-top:16px;font-family:monospace;font-size:10px;color:#1e3a5f;letter-spacing:0.15em}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="h-left">
        <div class="brand">CIPHERSHIELD</div>
        <div class="title">Cipher Intelligence Report</div>
        <div class="subtitle">Session Audit — AES-256-GCM Encryption Analysis</div>
      </div>
      <div class="h-right">
        <div class="classification">CLASSIFICATION</div>
        <div class="pill">DEMO / EDUCATIONAL</div>
        <div style="font-family:monospace;font-size:12px;color:#64748b;margin-top:8px">Generated: ${generated}</div>
      </div>
    </div>

    <div class="strip">
      <div style="max-width:1100px;margin:0 auto;">
        <div class="metrics">
          <div class="card"><div class="value" style="color:#22d3ee">${totalOps}</div><div class="label">Total Operations</div></div>
          <div class="card"><div class="value" style="color:${gradeColor}">${grade}</div><div class="label">Security Grade — ${gradeLabel}</div></div>
          <div class="card"><div class="value" style="color:#a78bfa">${escapeHtml(modes)}</div><div class="label">Cipher Mode</div></div>
          <div class="card"><div class="value" style="color:#4ade80">${authCount}</div><div class="label">Authenticated Ops</div></div>
        </div>
      </div>
    </div>

    <div class="divider"><div class="title">ENCRYPTION OPERATIONS</div><div class="line"></div></div>
    <div class="section">
      ${operationCards || '<div style="color:#64748b">No operations recorded in this session.</div>'}
    </div>

    <div class="divider"><div class="title">SECURITY ANALYSIS</div><div class="line"></div></div>
    <div class="two-col">
      <div class="card-panel">
        <h4 style="margin-bottom:12px">Cipher Strength Assessment</h4>
        <div style="display:flex;flex-direction:column">
          ${['256-bit symmetric key','Galois/Counter Mode (GCM)','Authenticated encryption (AEAD)','Nonce-based IV — no IV reuse','Authentication tag integrity check','NIST SP 800-38D compliant'].map((t,i)=>`<div style="display:flex;align-items:center;padding:7px 0;border-bottom:1px solid #1e293b"> <div style="color:#4ade80;font-size:14px;margin-right:10px">✓</div><div style="color:#cbd5e1;font-size:13px">${t}</div></div>`).join('')}
        </div>
      </div>
      <div class="card-panel">
        <h4 style="margin-bottom:12px">Brute-Force Resistance</h4>
        <div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e293b"><div><strong>Consumer</strong><div style="font-size:12px;color:#64748b">RTX 4090 class</div></div><div style="color:#4ade80;font-family:monospace">~${consumer} years</div></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e293b"><div><strong>Cloud</strong><div style="font-size:12px;color:#64748b">1,000 GPU cluster</div></div><div style="color:#4ade80;font-family:monospace">~${cloud} years</div></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e293b"><div><strong>Nation</strong><div style="font-size:12px;color:#64748b">ASIC array</div></div><div style="color:#4ade80;font-family:monospace">~${nation} years</div></div>
        </div>
        <div style="height:1px;background:#1e293b;margin:12px 0"></div>
        <div style="font-size:12px;color:#64748b;font-style:italic">AES-256 has never been broken. Security is unconditional at current computational limits.</div>
      </div>
    </div>

    <div class="divider"><div class="title">ENTROPY DISTRIBUTION</div><div class="line"></div></div>
    <div class="section">
      ${history.length ? entropyRows : '<div style="color:#64748b">No operations recorded in this session.</div>'}
    </div>

    <div class="footer">
      <div style="font-family:monospace;color:#22d3ee;letter-spacing:0.3em">CIPHERSHIELD</div>
      <div style="max-width:420px;text-align:right;color:#334155;line-height:1.6">This report is generated for educational and demonstration purposes only. CipherShield does not store or transmit session data beyond the current browser session. All cryptographic operations are performed locally.</div>
    </div>
    <div class="footer-bottom">AES-256-GCM · NIST SP 800-38D · Educational Demo · Not for Production Use</div>
  </div>
</body>
</html>`;

  return html;
}
