export interface Notification {
  id: number;
  userId: number;
  userName: string;
  action: 'accept' | 'offer';
  createdDate: string; // ISO date string from JSON
  readed: boolean;
}

export interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}
