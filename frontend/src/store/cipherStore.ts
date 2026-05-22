import { create } from 'zustand';
import type { CipherTab, HistoryItem, LogEntry } from '../types/cipher';

const storageKey = 'ciphershield-session-state';

const readSessionState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawState = window.sessionStorage.getItem(storageKey);
    return rawState ? JSON.parse(rawState) : null;
  } catch {
    return null;
  }
};

const persistSessionState = (state: Record<string, unknown>) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage failures and keep the in-memory session working.
  }
};

export interface EncryptionState {
  plaintext: string;
  ciphertext: string;
  decrypted: string;
  encryptionKey: string;
  nonce: string;
  tag: string;
  loading: boolean;
  currentTab: CipherTab;
  history: HistoryItem[];
  logs: LogEntry[];
  decryptTarget: HistoryItem | null;

  setPlaintext: (text: string) => void;
  setCiphertext: (text: string) => void;
  setDecrypted: (text: string) => void;
  setEncryptionKey: (key: string) => void;
  setNonce: (nonce: string) => void;
  setTag: (tag: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTab: (tab: EncryptionState['currentTab']) => void;
  addHistory: (item: EncryptionState['history'][0]) => void;
  clearHistory: () => void;
  addLog: (message: string, type: LogEntry['type']) => void;
  clearLogs: () => void;
  setDecryptTarget: (item: HistoryItem | null) => void;
  resetSession: () => void;
}

const sessionState = readSessionState();

export const useCipherStore = create<EncryptionState>((set) => ({
  plaintext: sessionState?.plaintext ?? '',
  ciphertext: sessionState?.ciphertext ?? '',
  decrypted: sessionState?.decrypted ?? '',
  encryptionKey: sessionState?.encryptionKey ?? '',
  nonce: sessionState?.nonce ?? '',
  tag: sessionState?.tag ?? '',
  loading: false,
  currentTab: sessionState?.currentTab ?? 'encrypt',
  history: sessionState?.history ?? [],
  logs: sessionState?.logs ?? [
    { timestamp: new Date().toLocaleTimeString(), message: 'CipherShield initialized', type: 'info' },
  ],
  decryptTarget: null,

  setPlaintext: (text) => set((state) => {
    persistSessionState({ ...state, plaintext: text });
    return { plaintext: text };
  }),
  setCiphertext: (text) => set((state) => {
    persistSessionState({ ...state, ciphertext: text });
    return { ciphertext: text };
  }),
  setDecrypted: (text) => set((state) => {
    persistSessionState({ ...state, decrypted: text });
    return { decrypted: text };
  }),
  setEncryptionKey: (key) => set((state) => {
    persistSessionState({ ...state, encryptionKey: key });
    return { encryptionKey: key };
  }),
  setNonce: (nonce) => set((state) => {
    persistSessionState({ ...state, nonce });
    return { nonce };
  }),
  setTag: (tag) => set((state) => {
    persistSessionState({ ...state, tag });
    return { tag };
  }),
  setLoading: (loading) => set({ loading }),
  setCurrentTab: (tab) => set((state) => {
    persistSessionState({ ...state, currentTab: tab });
    return { currentTab: tab };
  }),
  
  addHistory: (item) => set((state) => {
    const nextHistory = [item, ...state.history].slice(0, 50);
    persistSessionState({ ...state, history: nextHistory });
    return { history: nextHistory };
  }),

  clearHistory: () => set((state) => {
    persistSessionState({ ...state, history: [] });
    return { history: [] };
  }),

  addLog: (message, type = 'info') => set((state) => {
    const nextLogs = [
      { timestamp: new Date().toLocaleTimeString(), message, type },
      ...state.logs,
    ].slice(0, 100);

    persistSessionState({ ...state, logs: nextLogs });

    return { logs: nextLogs };
  }),

  clearLogs: () => set((state) => {
    persistSessionState({ ...state, logs: [] });
    return { logs: [] };
  }),

  setDecryptTarget: (item) => set((state) => {
    persistSessionState({ ...state, decryptTarget: item });
    return { decryptTarget: item };
  }),

  resetSession: () => set((state) => {
    const nextLogs: LogEntry[] = [
      { timestamp: new Date().toLocaleTimeString(), message: 'Session reset', type: 'info' },
    ];

    persistSessionState({
      ...state,
      plaintext: '',
      ciphertext: '',
      decrypted: '',
      encryptionKey: '',
      nonce: '',
      tag: '',
      loading: false,
      currentTab: 'encrypt',
      history: [],
      logs: nextLogs,
      decryptTarget: null,
    });

    return {
      plaintext: '',
      ciphertext: '',
      decrypted: '',
      encryptionKey: '',
      nonce: '',
      tag: '',
      loading: false,
      currentTab: 'encrypt',
      history: [],
      logs: nextLogs,
      decryptTarget: null,
    };
  }),
}));
