"""CipherShield - Secure Web-Based AES Encryption System.

A modern web application for encrypting and decrypting messages using
AES-256-GCM encryption.
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from routes.cipher import router as cipher_router

app = FastAPI(
    title="CipherShield",
    description="Secure AES-256-GCM encryption and decryption system",
    version="2.0.0",
)

# Include routers (API routes take precedence)
app.include_router(cipher_router)

# Mount static files (frontend) at /static
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")


@app.get("/")
async def read_root():
    """Serve the main HTML file."""
    frontend_file = os.path.join(
        os.path.dirname(__file__), "..", "frontend", "index.html"
    )
    if os.path.exists(frontend_file):
        return FileResponse(frontend_file)
    return {"message": "CipherShield API - Frontend not found"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "CipherShield"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
