import type { UseNotificationPanelReturn } from '../types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotifications from './useNotifications'

function useNotificationPanel(userId: number, onClose?: () => void): UseNotificationPanelReturn {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const {
    newNotifications,
    viewedNotifications,
    hasUnread,
    readAll: readAllNotifications,
    clearViewed: clearViewedNotifications,
    markAsRead,
  } = useNotifications(userId)

  const toggle = (open: boolean) => {
    setIsOpen(open)
    if (!open)
      onClose?.()
  }

  const readAll = () => {
    readAllNotifications()
  }

  const clearViewed = () => {
    clearViewedNotifications()
  }

  const onNotificationClick = (id: number) => {
    markAsRead(id)
    navigate(`/profile/requests?requestId=${id}`)
  }

  return {
    isOpen,
    newNotifications,
    viewedNotifications,
    hasUnread,
    toggle,
    readAll,
    clearViewed,
    onNotificationClick,
  }
}

export default useNotificationPanel
