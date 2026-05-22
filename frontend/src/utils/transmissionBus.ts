export type TransmissionEvent =
  | {
      type: 'PACKET_DISPATCHED'
      payload: { id: string; size: number; mode: string; timestamp: number }
    }
  | {
      type: 'INTERCEPTION_ATTEMPT'
      payload: { id: string; attackType: 'MITM_ATTEMPT' | 'REPLAY_ATTACK' | 'KEY_PROBE' }
    }
  | { type: 'PACKET_DELIVERED'; payload: { id: string; verified: boolean; timestamp: number } }
  | { type: 'TRANSMISSION_RESET'; payload: Record<string, never> }

// Internal listener storage: plain object mapping event type -> array of Functions
const listeners: Record<string, Function[]> = {}

export const transmissionBus = {
  emit(event: TransmissionEvent): void {
    const handlers = listeners[event.type]
    if (!handlers || handlers.length === 0) return
    // copy to avoid mutation during iteration
    const copy = handlers.slice()
    for (const fn of copy) {
      try {
        ;(fn as (payload: any) => void)(event.payload)
      } catch (e) {
        // swallow handler errors to avoid breaking emit
      }
    }
  },

  on(eventType: TransmissionEvent['type'], handler: (payload: any) => void): () => void {
    if (!listeners[eventType]) listeners[eventType] = []
    listeners[eventType].push(handler as unknown as Function)

    // unsubscribe function
    return () => {
      const arr = listeners[eventType]
      if (!arr) return
      const idx = arr.indexOf(handler as unknown as Function)
      if (idx >= 0) arr.splice(idx, 1)
    }
  },

  clear(): void {
    for (const k in listeners) {
      if (Object.prototype.hasOwnProperty.call(listeners, k)) {
        delete listeners[k]
      }
    }
  },
}

export default transmissionBus
