# CipherShield - Secure Web-Based AES Encryption Platform

![CipherShield](https://img.shields.io/badge/CipherShield-v2.0-blue?style=flat-square&logo=security)
![AES-256](https://img.shields.io/badge/Encryption-AES--256--GCM-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)

A modern, professional web-based secure communication system for encrypting and decrypting messages using industry-standard **AES-256-GCM** encryption. Built as an Information Security lab project demonstrating cryptographic best practices.

## 🎯 Features

- **AES-256-GCM Encryption**: Military-grade authenticated encryption with integrity verification
- **Modern Web UI**: Professional cybersecurity-themed dark interface with glassmorphism design
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Encryption/Decryption**: Instant message processing with visual feedback
- **Secure Key Generation**: Cryptographically secure random AES key generation
- **One-Click Copy**: Easy clipboard integration for all encrypted components
- **Message Verification**: Verify that decrypted text matches the original plaintext
- **RESTful API**: Clean backend API with proper error handling
- **Production-Ready**: Modular, well-documented code suitable for enterprise use

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern glassmorphism and gradient styling
- **JavaScript (Vanilla)** - Interactive UI with async/await API calls

### Backend
- **FastAPI** (Python) - Modern, fast async web framework
- **Pydantic** - Data validation and serialization
- **Pycryptodome** - Industry-standard cryptography library
- **Uvicorn** - ASGI server

### Encryption
- **AES-256-GCM** (Advanced Encryption Standard)
  - 256-bit key size (maximum security)
  - Galois/Counter Mode for authenticated encryption
  - Ensures confidentiality + integrity + authenticity

## 📁 Project Structure

```
CipherShield/
├── backend/
│   ├── app.py                 # FastAPI main application
│   ├── requirements.txt       # Python dependencies
│   ├── crypto/
│   │   ├── __init__.py
│   │   └── aes_encryption.py # AES-256-GCM implementation
│   └── routes/
│       ├── __init__.py
│       └── cipher.py          # API endpoints
├── frontend/
│   ├── index.html            # Main HTML interface
│   ├── css/
│   │   └── style.css         # Professional UI styling
│   └── js/
│       └── app.js            # Frontend logic
├── .gitignore                # Git ignore configuration
├── README.md                 # This file
└── SETUP.md                  # Setup and deployment guide
```

## ⚡ Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaafeadawood/ciphershield-aes-secure-communication.git
   cd CipherShield
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend server**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:8000`

4. **Open the frontend**
   - Open your browser and navigate to `http://localhost:8000`
   - Or directly open `frontend/index.html` in your browser

## 🚀 Usage Guide

### Basic Workflow

1. **Generate a Key**
   - Click the "Generate New Key" button
   - A secure AES-256 key will be created and displayed

2. **Encrypt a Message**
   - Enter your plaintext message in the "Plain Text Input" section
   - Click the "🔒 Encrypt" button
   - The encrypted output will appear in three components:
     - **Nonce**: Unique value for this encryption (needed for decryption)
     - **Ciphertext**: The encrypted message
     - **Authentication Tag**: Proves message integrity

3. **Decrypt a Message**
   - Click the "🔓 Decrypt" button
   - The original message will appear in the "Decrypted Output" section

4. **Verify Message**
   - Click "✓ Verify Match" to confirm the decrypted message matches the original

5. **Clear All**
   - Click "Clear All" to reset all fields

### API Endpoints

#### Generate Key
```bash
POST /api/cipher/generate-key
Response: { "key": "base64_encoded_key" }
```

#### Encrypt Message
```bash
POST /api/cipher/encrypt
Body: {
  "plaintext": "Your message here",
  "key": "base64_encoded_key"
}
Response: {
  "nonce": "base64_encoded_nonce",
  "ciphertext": "base64_encoded_ciphertext",
  "tag": "base64_encoded_tag"
}
```

#### Decrypt Message
```bash
POST /api/cipher/decrypt
Body: {
  "nonce": "base64_encoded_nonce",
  "ciphertext": "base64_encoded_ciphertext",
  "tag": "base64_encoded_tag",
  "key": "base64_encoded_key"
}
Response: { "plaintext": "Decrypted message" }
```

## 🔐 Security Features

- **AES-256-GCM**: Authenticated encryption with associated data (AEAD)
- **Cryptographically Secure Random**: Uses `Crypto.Random.get_random_bytes()` for key generation
- **Authentication Tags**: Ensures message hasn't been tampered with
- **UTF-8 Encoding**: Proper string-to-bytes conversion
- **Input Validation**: All inputs validated on backend
- **CORS-Ready**: Frontend communicates via standard HTTP (can be secured with HTTPS in production)

## 📊 Encryption Details

### AES-256-GCM Mode

| Parameter | Value |
|-----------|-------|
| **Algorithm** | AES (Rijndael) |
| **Key Size** | 256 bits (32 bytes) |
| **Mode** | GCM (Galois/Counter Mode) |
| **Authentication** | GMAC (128-bit tag) |
| **Nonce Size** | 96 bits (12 bytes) |

### Why AES-256-GCM?

- **Confidentiality**: AES encryption ensures only authorized parties can read the message
- **Integrity**: GCM mode detects any unauthorized modifications
- **Authenticity**: Provides assurance about the message source
- **Industry Standard**: Used by governments, military, and financial institutions

## 🛠️ Development

### Backend Development

The backend is organized with clean separation of concerns:

```python
# Crypto operations
from backend.crypto import AESCipher

# Generate key
key = AESCipher.generate_key()

# Encrypt
payload = AESCipher.encrypt("Hello", key)

# Decrypt
message = AESCipher.decrypt(payload, key)
```

### Frontend Development

The frontend uses vanilla JavaScript with clean API integration:

```javascript
// Generate key
const response = await fetch('http://localhost:8000/api/cipher/generate-key', 
  { method: 'POST' });
const data = await response.json();

// Encrypt
const response = await fetch('http://localhost:8000/api/cipher/encrypt',
  {
    method: 'POST',
    body: JSON.stringify({ plaintext, key })
  });
```

## 📦 Dependencies

### Backend (`requirements.txt`)
```
fastapi>=0.104.0
uvicorn>=0.24.0
pycryptodome>=3.20.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

### Frontend
- No external dependencies (vanilla JavaScript)
- Modern browser required

## 🚢 Deployment

### Development
```bash
cd backend
python app.py
```

### Production
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

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
```

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
