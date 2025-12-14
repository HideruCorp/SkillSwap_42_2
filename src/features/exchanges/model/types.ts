import type { Exchange } from '@shared/types';

/** Данные для создания нового обмена (без id и createdAt) */
export interface CreateExchangePayload {
  requestId: number;
  skills: [number, number];
  status?: Exchange['status'];
}
