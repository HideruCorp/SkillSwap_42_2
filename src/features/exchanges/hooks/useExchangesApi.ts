import { useDispatch } from '@app/store'
import {
  cancelExchange as handleCancelExchange,
  completeExchange as handleCompleteExchange,
} from '@entities/exchange'
import { useCallback } from 'react'

/**
 * Хук для работы с API обменов
 * Управление жизненным циклом обменов (завершение, отмена)
 */
export default function useExchangesApi() {
  const dispatch = useDispatch()

  /**
   * Завершает обмен: меняет статус на 'completed' и устанавливает completedAt
   * Валидация статуса выполняется на уровне reducer
   */
  const completeExchange = useCallback(
    (id: number): void => {
      dispatch(handleCompleteExchange(id))
    },
    [dispatch],
  )

  /**
   * Отменяет обмен: меняет статус на 'cancelled' и устанавливает completedAt
   * Валидация статуса выполняется на уровне reducer
   */
  const cancelExchange = useCallback(
    (id: number): void => {
      dispatch(handleCancelExchange(id))
    },
    [dispatch],
  )

  return {
    completeExchange,
    cancelExchange,
  }
}
