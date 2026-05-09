import axios from 'axios';

const API_BASE = '/api/cipher';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EncryptResponse {
  ciphertext: string;
  nonce: string;
  tag: string;
}

export interface DecryptResponse {
  plaintext: string;
}

export interface KeyResponse {
  key: string;
}

export const cipherApi = {
  generateKey: async (): Promise<KeyResponse> => {
    const response = await api.post('/generate-key');
    return response.data;
  },

  encrypt: async (plaintext: string, key: string): Promise<EncryptResponse> => {
    const response = await api.post('/encrypt', {
      plaintext,
      key,
    });
    return response.data;
  },

  decrypt: async (ciphertext: string, key: string, nonce: string, tag: string): Promise<DecryptResponse> => {
    const response = await api.post('/decrypt', {
      ciphertext,
      key,
      nonce,
      tag,
    });
    return response.data;
  },
};
