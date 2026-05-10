import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/cipher';

export const useApi = () => {
  const generateKey = async (): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-key`);
      return response.data.key;
    } catch (error) {
      console.error('Failed to generate key:', error);
      throw error;
    }
  };

  const encryptData = async (
    plaintext: string,
    key: string
  ): Promise<{ key: string; ciphertext: string; nonce: string; tag: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/encrypt`, {
        plaintext,
        key,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to encrypt:', error);
      throw error;
    }
  };

  const decryptData = async (
    ciphertext: string,
    key: string,
    nonce: string,
    tag: string
  ): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/decrypt`, {
        ciphertext,
        key,
        nonce,
        tag,
      });
      return response.data.plaintext;
    } catch (error) {
      console.error('Failed to decrypt:', error);
      throw error;
    }
  };

  return {
    generateKey,
    encryptData,
    decryptData,
  };
};
