"""AES encryption/decryption routes for CipherShield API."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from crypto import AESCipher

router = APIRouter(prefix="/api/cipher", tags=["cipher"])


class KeyRequest(BaseModel):
    """Request model for generating a new AES key."""

    pass


class KeyResponse(BaseModel):
    """Response model containing generated AES key."""

    key: str


class EncryptRequest(BaseModel):
    """Request model for encryption."""

    plaintext: str
    key: str


class EncryptResponse(BaseModel):
    """Response model for encrypted data."""

    nonce: str
    tag: str
    ciphertext: str


class DecryptRequest(BaseModel):
    """Request model for decryption."""

    nonce: str
    tag: str
    ciphertext: str
    key: str


class DecryptResponse(BaseModel):
    """Response model for decrypted data."""

    plaintext: str


@router.post("/generate-key", response_model=KeyResponse)
def generate_key():
    """Generate a new AES-256 key.

    Returns:
        KeyResponse containing Base64-encoded key.
    """
    key = AESCipher.generate_key()
    return KeyResponse(key=key)


@router.post("/encrypt", response_model=EncryptResponse)
def encrypt_message(request: EncryptRequest):
    """Encrypt plaintext using provided AES key.

    Args:
        request: EncryptRequest with plaintext and key.

    Returns:
        EncryptResponse with Base64-encoded nonce, tag, and ciphertext.

    Raises:
        HTTPException: If encryption fails.
    """
    try:
        payload = AESCipher.encrypt(request.plaintext, request.key)
        return EncryptResponse(
            nonce=payload.nonce, tag=payload.tag, ciphertext=payload.ciphertext
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Encryption failed")


@router.post("/decrypt", response_model=DecryptResponse)
def decrypt_message(request: DecryptRequest):
    """Decrypt ciphertext using provided AES key.

    Args:
        request: DecryptRequest with nonce, tag, ciphertext, and key.

    Returns:
        DecryptResponse with decrypted plaintext.

    Raises:
        HTTPException: If decryption fails or authentication fails.
    """
    try:
        from crypto.aes_encryption import EncryptedPayload

        payload = EncryptedPayload(
            nonce=request.nonce, tag=request.tag, ciphertext=request.ciphertext
        )
        plaintext = AESCipher.decrypt(payload, request.key)
        return DecryptResponse(plaintext=plaintext)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed")
