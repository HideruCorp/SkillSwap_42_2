import { DatePickerUI } from '@shared/ui/date-picker';
import DropdownListUI from '@shared/ui/dropdown-list/DropdownListUI';
import Textarea from '@shared/ui/textarea/Textarea';
import { AvatarPicker } from '@features/avatar-picker';
import type { OptionType } from '@shared/ui/dropdown-list';
import Button from '@shared/ui/button/Button';
import { InputUI } from '@shared/ui/Input';
import type { City } from '@shared/types';
import { useEffect, useState, type SyntheticEvent } from 'react';
import cityApi from '@entities/city/api/citiesApi';
import { useAuthState } from '@features/auth';
import styles from './profile-edit-form.module.scss';

const sex: OptionType[] = [
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
];

function ProfileEditForm() {
  const { currentUser } = useAuthState();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<OptionType>();
  const [selectedSex, setSelectedSex] = useState<OptionType>(
    sex.find((item) => item.value === currentUser?.gender)!
  );
  const [email, setEmail] = useState(currentUser?.email || '');
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [textAbout, setTextAbout] = useState(currentUser?.about || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(currentUser?.dateOfBirth!));
  const [avatar, setAvatar] = useState(currentUser?.avatarUrl);
  const [editFormChange, setEditFormChange] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const citiesRes = await cityApi.getCities();
        setCities(citiesRes);
        const userCity = citiesRes.find((city) => city.id === currentUser?.cityId);
        setSelectedCity({
          value: (userCity || cities[0]).id.toString(),
          title: (userCity || cities[0]).name,
        });
      } catch (error) {
        console.error('Error loading cities data:', error);
      }
    };

    loadData();
  }, []);

  const cityOptions = cities.map((city) => ({
    value: city.id.toString(),
    title: city.name,
  })) as OptionType[];

  const handleCityChange = (selected: OptionType[]) => {
    setSelectedCity(selected[0]);
    setEditFormChange(true);
  };

  const handleSexChange = (selected: OptionType[]) => {
    setSelectedSex(selected[0]);
    setEditFormChange(true);
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
    setEditFormChange(true);
  };

  const onChangeName = (value: string) => {
    setUserName(value);
    setEditFormChange(true);
  };

  const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAbout(e.currentTarget.value);
    setEditFormChange(true);
  };

  const onChangeDateOfBirth = (value: Date | undefined) => {
    if (value) {
      setDateOfBirth(value);
      setEditFormChange(true);
    }
  };

  const onChangeAvatar = (value: File | null) => {
    setAvatar(value ? URL.createObjectURL(value) : undefined);
    setEditFormChange(true);
  };

  const onSumbitEditForm = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Данные обновлены');
    setEditFormChange(false);
  };

  return (
    <div className={styles.mainInfo}>
      <form className={styles.formEdit} onSubmit={onSumbitEditForm}>
        <InputUI label="Почта" type="text" value={email} onChange={onChangeEmail} />
        <InputUI label="Имя" type="text" value={userName} onChange={onChangeName} />
        <div className={styles.row}>
          <label>
            <p className={styles.dateOfBirth}>Дата рождения</p>
            <DatePickerUI onChange={onChangeDateOfBirth} value={dateOfBirth} placeholder="" />
          </label>
          <div className={styles.sex}>
            <DropdownListUI
              title="Пол"
              type="list"
              onChange={handleSexChange}
              selected={[selectedSex || sex[0]]}
              options={sex}
              placeholder="Пол"
            />
          </div>
        </div>
        <div className={styles.city}>
          <DropdownListUI
            title="Город"
            type="list"
            onChange={handleCityChange}
            selected={[selectedCity || cityOptions[0]]}
            options={cityOptions}
            placeholder="город"
          />
        </div>

        <label>
          <p className={styles.about}>О себе</p>
          <Textarea className={styles.textarea} value={textAbout} onChange={onChangeText} />
        </label>
        <Button title="Сохранить" htmlType="submit" variant="primary" disabled={!editFormChange} />
      </form>
      <div className={styles.avatar}>
        <AvatarPicker
          className={styles.avatarImg}
          size={300}
          initialAvatarUrl={avatar}
          onAvatarChange={onChangeAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileEditForm;
