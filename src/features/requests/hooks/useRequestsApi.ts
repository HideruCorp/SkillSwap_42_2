import { useCallback } from 'react';
import { addRequest } from '@entities/request';
import type { Request } from '@shared/types';
import generateNumericId from '@shared/lib/utils';
import { useDispatch } from '@app/store';
import type { CreateRequestPayload } from '../model/types';

/**
 * Хук для работы с API заявок
 * Содержит бизнес-логику создания заявок (генерация ID, timestamps)
 */
export default function useRequestsApi() {
  const dispatch = useDispatch();

  /**
   * Создаёт новую заявку с автоматической генерацией ID и createdAt
   */
  const createRequest = useCallback(
    (payload: CreateRequestPayload): Request => {
      const request: Request = {
        id: generateNumericId(),
        requestedSkill: payload.requestedSkill,
        fromUser: payload.fromUser,
        status: payload.status || 'pending',
        createdAt: new Date().toISOString(),
      };

      dispatch(addRequest(request));
      return request;
    },
    [dispatch]
  );

  return {
    createRequest,
  };
}
