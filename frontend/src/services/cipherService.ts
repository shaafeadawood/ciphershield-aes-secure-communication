import axios from 'axios';

interface ErrorResponseShape {
  detail?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ErrorResponseShape>(error)) {
    return error.response?.data?.detail ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export async function generateKey(): Promise<{ key: string }> {
  try {
    const response = await axios.post<{ key: string }>('/api/cipher/generate-key', {});
    return { key: response.data.key };
  } catch (error: unknown) {
    throw new Error(`Key generation failed: ${getErrorMessage(error, 'Unable to generate key')}`);
  }
}

export async function encryptMessage(plaintext: string, key: string): Promise<{ ciphertext: string; nonce: string; tag: string }> {
  try {
    const response = await axios.post<{ ciphertext: string; nonce: string; tag: string }>('/api/cipher/encrypt', {
      plaintext,
      key,
    });

    return {
      ciphertext: response.data.ciphertext,
      nonce: response.data.nonce,
      tag: response.data.tag,
    };
  } catch (error: unknown) {
    throw new Error(`Encryption failed: ${getErrorMessage(error, 'Unable to encrypt message')}`);
  }
}

export async function decryptMessage(ciphertext: string, key: string, nonce: string, tag: string): Promise<{ plaintext: string }> {
  try {
    const response = await axios.post<{ plaintext: string }>('/api/cipher/decrypt', {
      ciphertext,
      key,
      nonce,
      tag,
    });

    return { plaintext: response.data.plaintext };
  } catch (error: unknown) {
    throw new Error(`Decryption failed: ${getErrorMessage(error, 'Unable to decrypt message')}`);
  }
}

export async function healthCheck(): Promise<{ status: string }> {
  try {
    const response = await axios.get<{ status: string }>('/api/health');
    return { status: response.data.status };
  } catch (error: unknown) {
    throw new Error(`Health check failed: ${getErrorMessage(error, 'Backend unavailable')}`);
  }
}
