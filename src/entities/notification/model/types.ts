export interface Notification {
  id: number;
  userId: number; // Кому уведомление (получатель)
  fromUserId: number; // От кого уведомление (отправитель)
  action: 'accept' | 'offer';
  createdDate: string; // ISO date string from JSON
  readed: boolean;
  requestId?: number; // ID связанной заявки (для перехода при клике)
}

export interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}
