"""CipherShield Phase 1: Core AES encryption/decryption in terminal.

This module demonstrates secure message encryption and decryption using
AES-GCM from the pycryptodome library.
"""

from __future__ import annotations

import base64
from dataclasses import dataclass

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes


@dataclass
class EncryptedPayload:
    """Container for encrypted output pieces."""

    nonce: bytes
    tag: bytes
    ciphertext: bytes


def generate_aes_key(key_size: int = 32) -> bytes:
    """Generate a cryptographically secure random AES key.

    Args:
        key_size: Length of the key in bytes.
                  16 = AES-128, 24 = AES-192, 32 = AES-256.

    Returns:
        Randomly generated key bytes.
    """
    return get_random_bytes(key_size)


def encrypt_message(plaintext: str, key: bytes) -> EncryptedPayload:
    """Encrypt a plaintext message using AES-GCM.

    Args:
        plaintext: The user message as a UTF-8 string.
        key: AES key bytes.

    Returns:
        EncryptedPayload containing nonce, tag, and ciphertext bytes.
    """
    cipher = AES.new(key, AES.MODE_GCM)
    plaintext_bytes = plaintext.encode("utf-8")
    ciphertext, tag = cipher.encrypt_and_digest(plaintext_bytes)

    return EncryptedPayload(nonce=cipher.nonce, tag=tag, ciphertext=ciphertext)


def decrypt_message(payload: EncryptedPayload, key: bytes) -> str:
    """Decrypt an AES-GCM payload and verify its integrity.

    Args:
        payload: EncryptedPayload with nonce, tag, and ciphertext.
        key: AES key bytes used during encryption.

    Returns:
        The original plaintext string decoded from UTF-8.
    """
    cipher = AES.new(key, AES.MODE_GCM, nonce=payload.nonce)
    plaintext_bytes = cipher.decrypt_and_verify(payload.ciphertext, payload.tag)
    return plaintext_bytes.decode("utf-8")


def b64(data: bytes) -> str:
    """Convert raw bytes to Base64 text for safe terminal display."""
    return base64.b64encode(data).decode("ascii")


def main() -> None:
    """Run a simple terminal demonstration for AES encrypt/decrypt."""
    print("=== CipherShield Phase 1: AES Core ===")

    plaintext = input("Enter a plaintext message: ").strip()
    if not plaintext:
        print("No message entered. Exiting.")
        return

    key = generate_aes_key()
    payload = encrypt_message(plaintext, key)
    decrypted_text = decrypt_message(payload, key)

    print("\n--- Encryption Output ---")
    print(f"Generated AES-256 Key (Base64): {b64(key)}")
    print(f"Nonce (Base64): {b64(payload.nonce)}")
    print(f"Ciphertext (Base64): {b64(payload.ciphertext)}")
    print(f"Authentication Tag (Base64): {b64(payload.tag)}")

    print("\n--- Decryption Output ---")
    print(f"Recovered Plaintext: {decrypted_text}")


if __name__ == "__main__":
    main()
