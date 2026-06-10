# CipherShield

CipherShield — Advanced Secure Communication & Encryption Visualization

CipherShield is an educational and research‑oriented platform that demonstrates modern secure communication using AES authenticated encryption (AES‑GCM). It combines an interactive React frontend with a FastAPI backend to visualize encryption workflows, simulate interception and tampering attacks, and teach robust cryptographic practices.

This repository is intended for students, researchers, and instructors who want a hands‑on environment to study symmetric encryption, authenticated modes, and practical security tradeoffs.

## Key Focus

- Core cryptography: AES (128/192/256) with emphasis on AES‑256‑GCM (AEAD)
- Secure transmission: nonce/IV discipline, authentication tags, and tamper detection
- Attack simulation: passive interception (sniffing) and active tampering demonstrations
- Pedagogy: comparisons with weak/classical ciphers, live logs, and step‑by‑step visualizations

## Architecture Overview

- Frontend: React + TypeScript + Vite — interactive visualizations and controls
- Backend: FastAPI (Python) — typed API routes for key generation, encryption, and decryption
- Crypto: AES‑GCM implementations exposed via backend routes; frontend drives the visualization and demo flows

The system intentionally separates the visualization layer from the crypto layer so students can observe both the protocol-level behavior and the underlying cryptographic primitives.

## Installation (Development)

1. Create and activate a Python virtual environment, then install backend dependencies:

```bash
python -m venv .venv
source .venv/Scripts/activate    # Windows (Git Bash) / adapt as needed
pip install -r backend/requirements.txt
```

2. Install frontend dependencies and run the dev server:

```bash
cd frontend
npm install
npm run dev
```

3. Start the backend API (from project root):

```bash
uvicorn backend.app:app --reload --port 8000
```

Frontend dev server defaults to `http://localhost:5173` and backend to `http://localhost:8000`.

## Quick Usage

- Use the UI to generate AES keys, encrypt messages, and visualize transmission across an insecure channel.
- Toggle attack simulations to observe packet capture and tampering attempts.
- Inspect live logs and message history to explore tag verification failures and replay scenarios.

## Security‑Relevant Implementation Notes

- AES Mode: the project uses AES‑GCM (AEAD) to demonstrate combined confidentiality and integrity. AES‑GCM requires unique nonces for each encryption under the same key — nonce reuse is insecure.
- Key Length: AES‑256 is available for demonstrations of high security margins; AES‑128 and AES‑192 may be used for performance comparisons.
- Key Generation: keys should be produced by a cryptographically secure RNG (CSPRNG). In production, use hardware key stores (HSM, cloud KMS) rather than application memory.
- Authentication Tags: AES‑GCM produces an authentication tag that must be validated before any plaintext is used. On tag failure, the system rejects the payload.
- Side Channels: the demo is not hardened against timing or cache side‑channel attacks. Real deployments require constant‑time implementations and hardware protections.

## API Endpoints (Development)

The backend exposes simple routes used by the frontend demo. Typical endpoints include:

- `GET /api/health` — backend health check
- `POST /api/cipher/generate-key` — returns a base64 key (demo only)
- `POST /api/cipher/encrypt` — accepts plaintext, returns ciphertext + nonce + tag
- `POST /api/cipher/decrypt` — accepts ciphertext + nonce + tag, returns plaintext (after tag verification)

> Note: These endpoints are designed for educational purposes. Do not use the demo API directly for production secret management.

## Educational Scenarios & Lab Ideas

- Visualize nonce reuse and observe resultant plaintext leakage in CTR/GCM modes.
- Simulate MITM tampering and show how authentication tags prevent silent modification.
- Compare AES ciphertext with classical Caesar cipher output to teach frequency and structural leakage.
- Demonstrate key compromise and how it enables decryption of captured traffic (highlight lack of forward secrecy for pure symmetric setups).

## Limitations

- Local demo: the application simulates transmission without using production networks or HSMs.
- No integrated PKI: identity and authentic key exchange are out of scope for the demo and should be added for production/complete protocol simulations.
- Not side‑channel hardened: implementations are demonstration‑grade, not FIPS‑level hardened.

## Contribution & Development

Contributions are welcome: open an issue describing the feature or bug, or submit a PR. Suggested improvements for security educators include adding:

- Ephemeral key exchange (ECDH) + hybrid encryption flows
- Certificate handling (PKI) and mutual TLS examples
- KMS/HSM integration and envelope encryption demos
- Automated test suites for cryptographic correctness and regression


## Contact

For questions about the demo, teaching materials, or cryptographic details, open an issue or contact the repository owner.
