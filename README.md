# CipherShield - AES-256-GCM Secure Communication

CipherShield is a professional cybersecurity web application for secure message encryption and decryption using AES-256-GCM.

## Features

- AES-256-GCM encryption and authenticated decryption
- React + TypeScript dashboard UI with 3D visualization
- Encryption history, simulation panel, and system logs
- FastAPI backend with clean API endpoints
- Production build served directly by backend

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js, Zustand, Axios
- Backend: FastAPI, Pydantic, Pycryptodome, Uvicorn

## Project Structure

```text
CipherShield/
├── backend/
│   ├── app.py
│   ├── crypto/
│   │   └── aes_encryption.py
│   └── routes/
│       └── cipher.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── panels/
│   │   │   ├── ui/
│   │   │   └── visualization/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── requirements.txt
```

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install --legacy-peer-deps
```

### 3. Build Frontend

```bash
npm run build
```

### 4. Run Backend

```bash
cd ../backend
python app.py
```

Open: http://localhost:8000

## Development Mode

Run backend and frontend separately:

```bash
# Terminal 1
cd backend
python app.py

# Terminal 2
cd frontend
npm run dev
```

Frontend dev server: http://localhost:5173

## API Endpoints

- POST /api/cipher/generate-key
- POST /api/cipher/encrypt
- POST /api/cipher/decrypt
- GET /health

## Security Notes

- Uses AES-256-GCM for confidentiality and integrity.
- Keys are generated securely and handled client-side for user workflows.
- Nonce and auth tag are required for decryption.

## Current Status

- Legacy static frontend files removed.
- React frontend is now the single source of truth.
- Backend serves the built frontend from frontend/dist when available.
  cd backend
  pip install -r requirements.txt
  uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4

````

For HTTPS in production, use Nginx as reverse proxy with SSL certificates.

## 📝 Git Workflow

The project follows a modular commit strategy:

```bash
# Phase 1: Initial setup
git commit -m "Initial project structure and setup files"

# Phase 2: Backend implementation
git commit -m "Implement AES-256-GCM encryption module"
git commit -m "Create FastAPI backend with cipher endpoints"

# Phase 3: Frontend implementation
git commit -m "Build professional cybersecurity UI"
git commit -m "Integrate frontend with backend API"

# Phase 4: Documentation
git commit -m "Add comprehensive README and documentation"
````

## 🐛 Troubleshooting

### Backend won't start

- Ensure Python 3.8+ is installed
- Check that port 8000 is not in use
- Verify all dependencies: `pip install -r requirements.txt`

### CORS errors

- Frontend and backend must be on same origin for local development
- Ensure backend is running on `http://localhost:8000`

### Encryption/Decryption errors

- Verify key format is Base64-encoded
- Ensure all encryption components (nonce, tag, ciphertext) are present
- Check that UTF-8 encoding is used for text

## 🎓 Educational Value

This project demonstrates:

- Modern web application architecture
- Cryptographic implementation best practices
- RESTful API design
- Frontend-backend integration
- Professional UI/UX design
- Git version control workflow
- Security considerations in software development

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Shaafea Dawood**

- GitHub: [@shaafeadawood](https://github.com/shaafeadawood)
- Project: [CipherShield AES Secure Communication](https://github.com/shaafeadawood/ciphershield-aes-secure-communication)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Show Your Support

If you find this project useful, please give it a star on GitHub!

---

**Last Updated**: May 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✓
