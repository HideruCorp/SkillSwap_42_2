import { useCallback } from 'react';
import { addRequest } from '@entities/request';
import { addNotification } from '@entities/notification';
import type { Notification } from '@entities/notification';
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
   * Создаёт новую заявку с автоматической генерацией ID и createdAt,
   * а также уведомление для владельца навыка
   */
  const createRequest = useCallback(
    (payload: CreateRequestPayload): Request => {
      // 1. Создаём заявку
      const request: Request = {
        id: generateNumericId(),
        requestedSkill: payload.requestedSkill,
        fromUser: payload.fromUser,
        status: payload.status || 'pending',
        createdAt: new Date().toISOString(),
      };

      dispatch(addRequest(request));

      // 2. Создаём уведомление для владельца навыка
      const notification: Notification = {
        id: generateNumericId(),
        userId: payload.toUser,
        fromUserId: payload.fromUser,
        action: 'offer',
        requestId: request.id,
        createdDate: new Date().toISOString(),
        readed: false,
      };

      dispatch(addNotification(notification));
      return request;
    },
    [dispatch]
  );

  return {
    createRequest,
  };
}
