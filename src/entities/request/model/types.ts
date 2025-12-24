import type { Request, RequestStatus } from '@shared/types'

export type { Request, RequestStatus }

export interface RequestsState {
  items: Request[]
  isLoading: boolean
  error: string | null
}
