# CipherShield

CipherShield is a cinematic cryptography workspace for AES-256-GCM encryption, decryption, live transmission visualization, and session auditing.

## Overview

The app pairs a React + TypeScript frontend with a FastAPI backend. The frontend handles the interactive security dashboard, while the backend exposes typed encryption routes and serves the production build.

## Features

- AES-256-GCM key generation, encryption, and decryption
- Live secure transmission simulation with packet interception states
- Encryption history with quick decrypt support and report export
- System log console with color-coded operational messages
- Backend health check and frontend service layer integration

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Framer Motion, Zustand, Axios
- Backend: FastAPI, Uvicorn, PyCryptodome
- Styling: Custom CSS, glassmorphism panels, neon cyber palette

## Ports

- Frontend dev server: `http://localhost:5173`
- Backend API server: `http://localhost:8000`
- Production frontend is served by the FastAPI app from the built Vite output

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Serves the compiled frontend in production |
| `GET` | `/health` | Backend health probe |
| `GET` | `/api/health` | Backend health probe used by the frontend |
| `POST` | `/api/cipher/generate-key` | Generates an AES-256 key |
| `POST` | `/api/cipher/encrypt` | Encrypts plaintext with AES-256-GCM |
| `POST` | `/api/cipher/decrypt` | Decrypts AES-256-GCM payloads |

## Project Structure

```text
CipherShield/
  backend/
  frontend/
```

Key frontend areas:

- `frontend/src/components/sections/` for the landing experience and operations center
- `frontend/src/components/panels/` for encrypt, decrypt, history, and analysis panels
- `frontend/src/sections/SecureTransmission/` for the packet transmission demo
- `frontend/src/services/cipherService.ts` for typed API calls
- `frontend/src/store/cipherStore.ts` for session state

## Setup

1. Install backend dependencies with `pip install -r backend/requirements.txt`.
2. Install frontend dependencies with `cd frontend && npm install`.
3. Start the backend on port `8000`.
4. Start the frontend on port `5173`.

## Scripts

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Notes

- The frontend calls the backend through `/api/*` routes during development.
- `frontend/vite.config.ts` proxies API requests to `http://localhost:8000`.
- The app uses local session storage for transient encryption history and logs.
