export interface NotificationItemProps {
  readed: boolean;
  userName: string; // Имя пользователя (резолвится из users по fromUserId)
  action: 'accept' | 'offer';
  createdDate: string;
  requestId?: number;
  onClick?: () => void;
}
