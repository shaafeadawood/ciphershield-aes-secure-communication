# CipherShield - Setup and Deployment Guide

## Initial Setup

### Step 1: Environment Setup

```bash
# Navigate to the project directory
cd CipherShield

# Create a Python virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Run the Application

```bash
# From the backend directory
python app.py
```

The application will start on `http://localhost:8000`

## Production Deployment

### Using Uvicorn with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY frontend/ ../frontend/

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t ciphershield .
docker run -p 8000:8000 ciphershield
```

### Using Nginx (Reverse Proxy)

Create `nginx.conf`:

```nginx
upstream ciphershield {
    server localhost:8000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://ciphershield;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## GitHub Setup and Push Instructions

### Initial Repository Setup

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial project structure and setup files"
```

### Connect to Remote Repository

```bash
# Add remote origin
git remote add origin https://github.com/shaafeadawood/ciphershield-aes-secure-communication.git

# Verify remote
git remote -v
```

### Push to GitHub

```bash
# Push to main branch
git push -u origin main

# Or if your default branch is master:
git push -u origin master
```

## Modular Commit Strategy

When developing features, follow this commit pattern:

```bash
# Phase 1: Infrastructure
git add backend/
git commit -m "Set up FastAPI backend with directory structure"

# Phase 2: Encryption module
git add backend/crypto/
git commit -m "Implement AES-256-GCM encryption module"

# Phase 3: API routes
git add backend/routes/
git commit -m "Create cipher encryption/decryption API endpoints"

# Phase 4: Frontend UI
git add frontend/css/ frontend/index.html
git commit -m "Build professional cybersecurity-themed UI"

# Phase 5: Frontend logic
git add frontend/js/
git commit -m "Implement frontend API integration and user interactions"

# Phase 6: Documentation
git add README.md SETUP.md
git commit -m "Add comprehensive documentation"
```

## Continuous Integration (Optional)

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11

      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt

      - name: Run tests
        run: |
          pytest backend/tests/
```

## Troubleshooting

### Port Already in Use

```bash
# Kill the process using port 8000
# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

### Module Import Errors

Ensure you're running from the correct directory:

```bash
cd backend
python app.py
```

### CORS Issues in Production

Add CORS middleware to `app.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

**For more information, see [README.md](README.md)**
