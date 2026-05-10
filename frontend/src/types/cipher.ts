export type CipherTab = 'encrypt' | 'decrypt' | 'history' | 'simulation' | 'about';

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

export interface HistoryItem {
  id: string;
  plaintext: string;
  ciphertext: string;
  timestamp: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
