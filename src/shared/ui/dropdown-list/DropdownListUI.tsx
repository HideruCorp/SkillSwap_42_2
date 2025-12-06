import { useState, useRef, useEffect } from 'react';
import type { MouseEventHandler } from 'react';
import arrowDown from '../../assets/img/chevron-Down.svg';
import checkboxDefault from '../../assets/img/checkbox-Default.svg';
import checkboxDone from '../../assets/img/checkbox-Done-Active.svg';
import type { OptionType, SelectProps } from './types';

import styles from './dropdown-list-ui.module.scss';

export function DropdownListUI(props: SelectProps) {
  const { options, placeholder, selected, onChange, title, type } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isChoose, setIsChoose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsChoose(selected.length > 0);
  }, [selected]);

  const handleOptionClick = (option: OptionType) => {
    if (type === 'list') {
      setIsOpen(false);
      onChange?.([option]);
    }
    if (type === 'сheckbox') {
      const isSelected = selected.some((element) => element === option);
      if (isSelected) {
        onChange?.(selected.filter((element) => element !== option));
      }
      if (!isSelected) {
        onChange?.([...selected, option]);
      }
    }
    if (type === 'input') {
      setIsOpen(false);
      onChange?.([option]);
      setSearchQuery(option.value);
    }
  };

  const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = () => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };

  const handleOptionKeyPress = (event: React.KeyboardEvent, option: OptionType) => {
    if (event.key === 'Enter') {
      handleOptionClick(option);
    }
  };

  const handlePlaceHolderKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsOpen((currentIsOpen) => !currentIsOpen);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsOpen(true);
  };

  return (
    <div className={styles.container}>
      {title && <h5 className={styles.title}>{title}</h5>}
      <div
        className={styles.selectWrapper}
        ref={rootRef}
        data-is-active={isOpen}
        data-testid="selectWrapper"
      >
        <div
          className={styles.placeholder}
          onClick={handlePlaceHolderClick}
          onKeyPress={handlePlaceHolderKeyPress}
          role="button"
          tabIndex={0}
          ref={placeholderRef}
        >
          {type === 'list' && (
            <h5 className={isChoose ? styles.placeholderActive : styles.placeholderPacive}>
              {isChoose ? selected[0]?.title : placeholder}
            </h5>
          )}
          {type === 'сheckbox' && (
            <h5 className={isChoose ? styles.placeholderActive : styles.placeholderPacive}>
              {isChoose ? `Выбрано: ${selected.length}` : placeholder}
            </h5>
          )}
          {type === 'input' && (
            <input
              type="text"
              className={styles.input}
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleInputChange}
            />
          )}
          <img src={arrowDown} alt="иконка стрелочки" className={styles.arrow} />
        </div>
        {isOpen && (
          <div className={styles.openSelect}>
            <ul
              className={
                type === 'input' ? `${styles.selectShort} ${styles.select}` : styles.select
              }
              data-testid="selectDropdown"
            >
              {options
                .filter((option) => option.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => {
                  const aMatch = a.title.toLowerCase().indexOf(searchQuery.toLowerCase());
                  const bMatch = b.title.toLowerCase().indexOf(searchQuery.toLowerCase());
                  return aMatch - bMatch;
                })
                .map((option) => (
                  <li key={option.value}>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionClick(option)}
                      onKeyPress={(event) => handleOptionKeyPress(event, option)}
                      role="button"
                      tabIndex={0}
                    >
                      {type === 'сheckbox' && !selected.some((element) => element === option) && (
                        <img
                          src={checkboxDefault}
                          alt="ячейка чекбокса"
                          className={styles.checkbox}
                        />
                      )}
                      {type === 'сheckbox' && selected.some((element) => element === option) && (
                        <img
                          src={checkboxDone}
                          alt="отмеченная ячейка чекбокса"
                          className={styles.checkbox}
                        />
                      )}
                      <h5 className={styles.point}>{option.title}</h5>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropdownListUI;
