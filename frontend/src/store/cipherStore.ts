import { create } from 'zustand';
import type { CipherTab, HistoryItem, LogEntry } from '../types/cipher';

export interface EncryptionState {
  plaintext: string;
  ciphertext: string;
  decrypted: string;
  encryptionKey: string;
  loading: boolean;
  currentTab: CipherTab;
  history: HistoryItem[];
  logs: LogEntry[];

  setPlaintext: (text: string) => void;
  setCiphertext: (text: string) => void;
  setDecrypted: (text: string) => void;
  setEncryptionKey: (key: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTab: (tab: EncryptionState['currentTab']) => void;
  addHistory: (item: EncryptionState['history'][0]) => void;
  clearHistory: () => void;
  addLog: (message: string, type: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useCipherStore = create<EncryptionState>((set) => ({
  plaintext: '',
  ciphertext: '',
  decrypted: '',
  encryptionKey: '',
  loading: false,
  currentTab: 'encrypt',
  history: [],
  logs: [
    { timestamp: new Date().toLocaleTimeString(), message: 'CipherShield initialized', type: 'info' },
  ],

  setPlaintext: (text) => set({ plaintext: text }),
  setCiphertext: (text) => set({ ciphertext: text }),
  setDecrypted: (text) => set({ decrypted: text }),
  setEncryptionKey: (key) => set({ encryptionKey: key }),
  setLoading: (loading) => set({ loading }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  addHistory: (item) => set((state) => ({
    history: [item, ...state.history].slice(0, 50),
  })),
  
  clearHistory: () => set({ history: [] }),
  
  addLog: (message, type = 'info') => set((state) => ({
    logs: [
      { timestamp: new Date().toLocaleTimeString(), message, type },
      ...state.logs,
    ].slice(0, 100),
  })),
  
  clearLogs: () => set({ logs: [] }),
}));
