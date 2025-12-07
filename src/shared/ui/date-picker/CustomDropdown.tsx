import { useMemo, useState } from 'react';
import ChevronDown from '@shared/assets/img/chevron-Down.svg?react';
import type { DropdownProps } from 'react-day-picker';
import { Dropdown } from '../dropdown';

import styles from './date-picker.module.scss';

function CustomDropdown({ value, onChange, options }: Partial<DropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options?.find((opt) => opt.value === value);
  return (
    <Dropdown
      className={styles['select-wrapper']}
      isOpen={isOpen}
      align="left"
      onToggle={(newIsOpen) => {
        setIsOpen(newIsOpen);
      }}
      trigger={
        <button type="button" className={styles.select}>
          {selectedOption?.label}
          <ChevronDown className={`${styles.chevron} ${isOpen ? styles['chevron--open'] : ''}`} />
        </button>
      }
    >
      <div className={styles['selector-dropdown']}>
        {options?.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles['selector-option']} ${
              opt.value === value ? styles['selector-option--selected'] : ''
            }`}
            onClick={() => {
              const syntheticEvent = {
                target: { value: opt.value.toString() },
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange?.(syntheticEvent);
              setIsOpen(false);
            }}
            disabled={opt.disabled}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Dropdown>
  );
}

function CustomYearsDropdown({ value, onChange, options }: Partial<DropdownProps>) {
  // Reverse the options to show newest years first
  const reversedOptions = useMemo(() => options?.slice().reverse(), [options]);

  return <CustomDropdown value={value} onChange={onChange} options={reversedOptions} />;
}

export { CustomDropdown, CustomYearsDropdown, type DropdownProps };
export default CustomDropdown;
