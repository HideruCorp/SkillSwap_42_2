import styles from './userInfo.module.scss';

interface UserInfoProps {
  userName: string;
  userAvatarUrl?: string;
}
function UserInfo({ userName, userAvatarUrl }: UserInfoProps) {
  return (
    <div className={`${styles.userInfo}`}>
      <p className={`${styles.userInfoName}`}>{userName}</p>
      <img
        className={`${styles.userInfoAvatar}`}
        src={userAvatarUrl || '../../../src/shared/assets/img/user-Circle.svg'}
        alt="фото пользователя"
      />
    </div>
  );
}

UserInfo.defaultProps = {
  userAvatarUrl: undefined,
};

export default UserInfo;
