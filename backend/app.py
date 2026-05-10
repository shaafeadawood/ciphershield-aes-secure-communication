"""CipherShield API and frontend serving configuration.

Provides AES-256-GCM API endpoints and serves the production frontend
build when available.
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from routes.cipher import router as cipher_router

app = FastAPI(
    title="CipherShield",
    description="Secure AES-256-GCM encryption and decryption system",
    version="3.0.0",
)

# Include routers (API routes take precedence)
app.include_router(cipher_router)


@app.get("/")
async def read_root():
    """Serve the built frontend index when available."""
    frontend_file = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html")
    if os.path.exists(frontend_file):
        return FileResponse(frontend_file)
    return {
        "message": "CipherShield API is running. Frontend build not found.",
        "hint": "Run 'npm run build' in the frontend directory.",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "CipherShield"}


# Serve frontend production assets after API and health routes are defined.
frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
