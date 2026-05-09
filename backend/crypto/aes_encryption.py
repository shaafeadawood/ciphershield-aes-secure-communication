"""AES-GCM encryption and decryption utilities for CipherShield."""

import base64
from dataclasses import dataclass, asdict
from typing import Dict

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes


@dataclass
class EncryptedPayload:
    """Container for encrypted components in Base64 format."""

    nonce: str
    tag: str
    ciphertext: str


class AESCipher:
    """Handles AES-256-GCM encryption and decryption operations."""

    KEY_SIZE = 32  # AES-256
    NONCE_SIZE = 16

    @staticmethod
    def generate_key() -> str:
        """Generate a cryptographically secure random AES-256 key.

        Returns:
            Base64-encoded key string for safe transmission and display.
        """
        key_bytes = get_random_bytes(AESCipher.KEY_SIZE)
        return base64.b64encode(key_bytes).decode("ascii")

    @staticmethod
    def encrypt(plaintext: str, key: str) -> EncryptedPayload:
        """Encrypt plaintext using AES-256-GCM mode.

        Args:
            plaintext: The message to encrypt (UTF-8 string).
            key: Base64-encoded AES-256 key.

        Returns:
            EncryptedPayload with Base64-encoded components.

        Raises:
            ValueError: If key is invalid or plaintext is empty.
        """
        if not plaintext:
            raise ValueError("Plaintext cannot be empty")

        try:
            key_bytes = base64.b64decode(key)
        except Exception:
            raise ValueError("Invalid key format")

        if len(key_bytes) != AESCipher.KEY_SIZE:
            raise ValueError(f"Key must be {AESCipher.KEY_SIZE} bytes")

        cipher = AES.new(key_bytes, AES.MODE_GCM)
        plaintext_bytes = plaintext.encode("utf-8")
        ciphertext, tag = cipher.encrypt_and_digest(plaintext_bytes)

        return EncryptedPayload(
            nonce=base64.b64encode(cipher.nonce).decode("ascii"),
            tag=base64.b64encode(tag).decode("ascii"),
            ciphertext=base64.b64encode(ciphertext).decode("ascii"),
        )

    @staticmethod
    def decrypt(payload: EncryptedPayload, key: str) -> str:
        """Decrypt an AES-256-GCM payload and verify integrity.

        Args:
            payload: EncryptedPayload with Base64-encoded components.
            key: Base64-encoded AES-256 key (must match encryption key).

        Returns:
            Decrypted plaintext as UTF-8 string.

        Raises:
            ValueError: If key is invalid, decryption fails, or tag verification fails.
        """
        try:
            key_bytes = base64.b64decode(key)
            nonce = base64.b64decode(payload.nonce)
            tag = base64.b64decode(payload.tag)
            ciphertext = base64.b64decode(payload.ciphertext)
        except Exception as e:
            raise ValueError(f"Invalid payload format: {str(e)}")

        if len(key_bytes) != AESCipher.KEY_SIZE:
            raise ValueError(f"Key must be {AESCipher.KEY_SIZE} bytes")

        try:
            cipher = AES.new(key_bytes, AES.MODE_GCM, nonce=nonce)
            plaintext_bytes = cipher.decrypt_and_verify(ciphertext, tag)
        except ValueError:
            raise ValueError("Authentication failed: ciphertext or tag corrupted")

        return plaintext_bytes.decode("utf-8")

    @staticmethod
    def payload_to_dict(payload: EncryptedPayload) -> Dict[str, str]:
        """Convert EncryptedPayload dataclass to dictionary.

        Args:
            payload: EncryptedPayload instance.

        Returns:
            Dictionary representation of the payload.
        """
        return asdict(payload)
