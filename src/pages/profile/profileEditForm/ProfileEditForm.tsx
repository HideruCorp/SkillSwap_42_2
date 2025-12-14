import styles from './profile-edit-form.module.scss';
import { DatePickerUI } from '@shared/ui/date-picker';
import DropdownListUI from '@shared/ui/dropdown-list/DropdownListUI';
import Textarea from '@shared/ui/textarea/Textarea';
import { AvatarPicker } from '@features/avatar-picker';
import type { OptionType } from '@shared/ui/dropdown-list';
import Button from '@shared/ui/button/Button';
import { InputUI } from '@shared/ui/Input';
import type { City } from '@shared/types';
import { useEffect, useState } from 'react';
import { fetchCities } from '@api/citiesApi';

const sex: OptionType[] = [
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
];

function ProfileEditForm() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<OptionType>();
  const [selectedSex, setSelectedSex] = useState<OptionType>(sex[0]);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [textAbout, setTextAbout] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const citiesRes = await fetchCities();
        setCities(citiesRes);
        setSelectedCity({ value: cities[0].id.toString(), title: cities[0].name });
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
  };

  const handleSexChange = (selected: OptionType[]) => {
    setSelectedSex(selected[0]);
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangeName = (value: string) => {
    setUserName(value);
  };

  const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAbout(e.currentTarget.value);
  };

  return (
    <div className={styles.mainInfo}>
      <form className={styles.formEdit}>
        <InputUI label="Почта" type="text" value={email} onChange={onChangeEmail} />
        <InputUI label="Имя" type="text" value={userName} onChange={onChangeName} />
        <div className={styles.row}>
          <label>
            <p className={styles.dateOfBirth}>Дата рождения</p>
            <DatePickerUI
              onChange={() => {
                alert;
              }}
              placeholder=""
            />
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
        <Button title="Сохранить" disabled={true} />
      </form>
      <div className={styles.avatar}>
        <AvatarPicker className={styles.avatarImg} size={300} onAvatarChange={() => {}} />
      </div>
    </div>
  );
}

export default ProfileEditForm;
