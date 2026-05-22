export type PacketStatus =
  | 'idle'
  | 'dispatched'
  | 'in-transit'
  | 'intercepted'
  | 'delivered'
  | 'failed'

export type AttackType = 'MITM_ATTEMPT' | 'REPLAY_ATTACK' | 'KEY_PROBE'

export type TransmissionPacket = {
  id: string
  ciphertext: string
  size: number
  mode: string
  status: PacketStatus
  dispatchedAt: number
  deliveredAt?: number
  intercepted: boolean
  attackType?: AttackType
}

export type TransmissionSession = {
  sessionId: string
  packets: TransmissionPacket[]
  startedAt: number
  totalInterceptions: number
  totalDelivered: number
}

export type TransmissionState = {
  isTransmitting: boolean
  currentSession: TransmissionSession | null
  history: TransmissionSession[]
}
