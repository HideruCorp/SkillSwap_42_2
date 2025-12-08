export interface NotificationItemProps {
  isNew: boolean;
  userName: string;
  action: 'accepts' | 'offers';
  createdDate: string;
  onClick?: () => void;
}
