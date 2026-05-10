import axios from 'axios';
import type { DecryptResponse, EncryptResponse, KeyResponse } from '../types/cipher';

const API_BASE = '/api/cipher';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
