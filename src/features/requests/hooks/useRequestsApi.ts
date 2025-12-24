import type { Notification } from '@entities/notification'
import type { Exchange, Request } from '@shared/types'
import type { AcceptRequestPayload, CreateRequestPayload } from '../model/types'
import store, { useDispatch, useSelector } from '@app/store'
import { addExchange } from '@entities/exchange'
import {
  addNotification,
  deleteNotification,
  selectAllNotifications,
} from '@entities/notification'
import { addRequest, deleteRequest, selectAllRequests, updateRequest } from '@entities/request'
import { useAuthState } from '@features/auth'
import generateNumericId from '@shared/lib/utils'
import { useCallback } from 'react'

/**
 * Хук для работы с API заявок
 * Содержит бизнес-логику создания заявок (генерация ID, timestamps)
 */
export default function useRequestsApi() {
  const dispatch = useDispatch()
  const requests = useSelector(selectAllRequests)
  const { currentUserId } = useAuthState()

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
      }

      dispatch(addRequest(request))

      // 2. Создаём уведомление для владельца навыка
      const notification: Notification = {
        id: generateNumericId(),
        userId: payload.toUser,
        fromUserId: payload.fromUser,
        action: 'offer',
        requestId: request.id,
        createdDate: new Date().toISOString(),
        readed: false,
      }

      dispatch(addNotification(notification))
      return request
    },
    [dispatch],
  )

  /**
   * Принимает заявку: меняет статус на 'accepted',
   * создаёт Exchange и отправляет уведомление отправителю заявки
   * @returns true если операция выполнена успешно, false если заявка не найдена или нет currentUserId
   */
  const acceptRequest = useCallback(
    (payload: AcceptRequestPayload): boolean => {
      const { requestId, givenSkillId, receivedSkillId } = payload

      // Проверяем наличие currentUserId
      if (!currentUserId) {
        return false
      }

      // Находим заявку
      const request = requests.find((r) => r.id === requestId)
      if (!request) {
        return false
      }

      // 1. Обновляем статус заявки на 'accepted'
      dispatch(updateRequest({ id: requestId, changes: { status: 'accepted' } }))

      // 2. Создаём Exchange
      const exchange: Exchange = {
        id: generateNumericId(),
        requestId,
        skills: [givenSkillId, receivedSkillId],
        status: 'inProgress',
        createdAt: new Date().toISOString(),
      }
      dispatch(addExchange(exchange))

      // 3. Создаём уведомление для отправителя заявки
      const notification: Notification = {
        id: generateNumericId(),
        userId: request.fromUser, // получатель — тот, кто отправил заявку
        fromUserId: currentUserId, // отправитель — текущий пользователь
        action: 'accept',
        requestId,
        createdDate: new Date().toISOString(),
        readed: false,
      }
      dispatch(addNotification(notification))

      return true
    },
    [dispatch, requests, currentUserId],
  )

  /**
   * Отклоняет заявку: меняет статус на 'rejected'
   * и отправляет уведомление отправителю заявки
   * @returns true если операция выполнена успешно, false если заявка не найдена или нет currentUserId
   */
  const rejectRequest = useCallback(
    (requestId: number): boolean => {
      // Проверяем наличие currentUserId
      if (!currentUserId) {
        return false
      }

      // Находим заявку
      const request = requests.find((r) => r.id === requestId)
      if (!request) {
        return false
      }

      // 1. Обновляем статус заявки на 'rejected'
      dispatch(updateRequest({ id: requestId, changes: { status: 'rejected' } }))

      // 2. Создаём уведомление для отправителя заявки
      const notification: Notification = {
        id: generateNumericId(),
        userId: request.fromUser,
        fromUserId: currentUserId,
        action: 'reject',
        requestId,
        createdDate: new Date().toISOString(),
        readed: false,
      }
      dispatch(addNotification(notification))

      return true
    },
    [dispatch, requests, currentUserId],
  )

  /**
   * Отменяет заявку: удаляет заявку и все связанные уведомления
   * @returns true если операция выполнена успешно
   */
  const cancelRequest = useCallback(
    (requestId: number): boolean => {
      // 1. Удаляем заявку
      dispatch(deleteRequest(requestId))

      // 2. Получаем актуальный state и находим все связанные уведомления
      const currentState = store.getState()
      const currentNotifications = selectAllNotifications(currentState)
      const relatedNotifications = currentNotifications.filter((n) => n.requestId === requestId)

      // 3. Удаляем найденные уведомления
      relatedNotifications.forEach((n) => {
        dispatch(deleteNotification(n.id))
      })

      return true
    },
    [dispatch],
  )

  return {
    createRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  }
}
