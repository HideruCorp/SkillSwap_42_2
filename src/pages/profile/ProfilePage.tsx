import { InputUI } from '@shared/ui/Input';
import styles from './profile-page.module.scss';
import { DatePickerUI } from '@shared/ui/date-picker';
import DropdownListUI from '@shared/ui/dropdown-list/DropdownListUI';
import Textarea from '@/shared/ui/textarea/Textarea';
import { AvatarPicker } from '@/features/avatar-picker';
import type { OptionType } from '@shared/ui/dropdown-list';

/**
 * ProfilePage - страница "Личные данные" в профиле пользователя
 * Реализует вкладку "Личные данные" в разделе профиля
 *
 * Роут: /profile
 *
 * className={styles['profile__some-bem--specific']}
 */

function ProfilePage() {
  const sex: OptionType[] = [
    { value: 'male', title: 'Мужской' },
    { value: 'female', title: 'Женский' },
  ];

  const handleSexChange = (selected: OptionType[]) => {
    console.info('SELECTED: ', selected);
    //TODO записать в стор
  };

  return (
    <section className={styles.profile}>
      <ul className={styles.sideBar}>
        <li className={styles.item}>
          <a href="/">
            <img src="../../../src/shared/assets/img/request.svg" />
            Заявки
          </a>
        </li>
        <li className={styles.item}>
          <a href="/">
            <img src="../../../src/shared/assets/img/message-Text.svg" />
            Мои обмены
          </a>
        </li>
        <li className={styles.item}>
          <a href="/">
            <img src="../../../src/shared/assets/img/like-Default.svg" />
            Избранное
          </a>
        </li>
        <li className={styles.item}>
          <a href="/">
            <img src="../../../src/shared/assets/img/idea.svg" />
            Мои навыки
          </a>
        </li>
        <li className={styles.item}>
          <a href="/">
            <img src="../../../src/shared/assets/img/user.svg" />
            Личные данные
          </a>
        </li>
      </ul>
      <div className={styles.mainInfo}>
        <div className={styles.formEdit}>
          <InputUI
            label="Почта"
            type="text"
            value="text"
            onChange={() => {
              alert;
            }}
          />
          <InputUI
            label="Имя"
            type="text"
            value="text"
            onChange={() => {
              alert;
            }}
          />
          <label >Дата рождения</label>
          <DatePickerUI
            onChange={() => {
              alert;
            }}
            placeholder=""
          />
          <DropdownListUI
            title=""
            type="list"
            onChange={handleSexChange}
            selected={[sex[0]]}
            options={sex}
            placeholder="Пол"
          />
          <Textarea />
        </div>
        <div className={styles.avatar}>avatar</div>
      </div>
    </section>
  );
}

export default ProfilePage;
