import type { Exchange, ExchangeStatus } from '@shared/types';

export type { Exchange, ExchangeStatus };

export interface ExchangesState {
  items: Exchange[];
  isLoading: boolean;
  error: string | null;
}
