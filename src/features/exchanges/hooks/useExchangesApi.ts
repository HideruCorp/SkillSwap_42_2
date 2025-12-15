import { useCallback } from 'react';
import { addExchange } from '@entities/exchange';
import type { Exchange } from '@shared/types';
import generateNumericId from '@shared/lib/utils';
import { useDispatch } from '@app/store';
import type { CreateExchangePayload } from '../model/types';

/**
 * Хук для работы с API обменов
 * Содержит бизнес-логику создания обменов (генерация ID, timestamps)
 */
export default function useExchangesApi() {
  const dispatch = useDispatch();

  /**
   * Создаёт новый обмен с автоматической генерацией ID и createdAt
   */
  const createExchange = useCallback(
    (payload: CreateExchangePayload): Exchange => {
      const exchange: Exchange = {
        id: generateNumericId(),
        requestId: payload.requestId,
        skills: payload.skills,
        status: payload.status || 'inProgress',
        createdAt: new Date().toISOString(),
      };

      dispatch(addExchange(exchange));
      return exchange;
    },
    [dispatch]
  );

  return {
    createExchange,
  };
}
