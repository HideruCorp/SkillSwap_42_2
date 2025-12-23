import { useState, useRef, useEffect, useCallback } from 'react';
import type { MouseEventHandler } from 'react';
import CheckboxDefaultIcon from '@shared/assets/img/checkbox-Default.svg?react';
import CheckboxDoneIcon from '@shared/assets/img/checkbox-Done-Active.svg?react';
import arrowDown from '../../assets/img/chevron-Down.svg';
import type { OptionType, SelectProps } from './types';

import styles from './dropdown-list-ui.module.scss';

export function DropdownListUI(props: SelectProps) {
  const {
    options,
    placeholder,
    selected,
    onChange,
    title,
    type,
    disabled = false,
    groupId,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isChoose, setIsChoose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const instanceIdRef = useRef(`ddl-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const effectiveGroupId = groupId ?? '__global__';

  const broadcastOpen = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('skillswap:dropdownlistui-open', {
        detail: { groupId: effectiveGroupId, id: instanceIdRef.current },
      })
    );
  }, [effectiveGroupId]);

  useEffect(() => {
    setIsChoose(selected.length > 0);
  }, [selected]);

  // Если компонент стал disabled — закрываем его
  useEffect(() => {
    if (disabled && isOpen) setIsOpen(false);
  }, [disabled, isOpen]);

  // Закрывать остальные DropdownListUI в рамках groupId
  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ groupId?: string; id?: string }>;
      if (!e.detail) return;
      if ((e.detail.groupId ?? '__global__') !== effectiveGroupId) return;
      if (e.detail.id === instanceIdRef.current) return;
      setIsOpen(false);
    };

    window.addEventListener('skillswap:dropdownlistui-open', handler as EventListener);
    return () => {
      window.removeEventListener('skillswap:dropdownlistui-open', handler as EventListener);
    };
  }, [effectiveGroupId]);

  // Закрытие по клику вне и по Escape
  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (rootRef.current && rootRef.current.contains(target)) return;
      setIsOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleOptionClick = (option: OptionType) => {
    if (disabled) return;
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
    if (disabled) return;
    setIsOpen((currentIsOpen) => {
      const next = !currentIsOpen;
      if (next) broadcastOpen();
      return next;
    });
  };

  const handleOptionKeyPress = (event: React.KeyboardEvent, option: OptionType) => {
    if (event.key === 'Enter') {
      handleOptionClick(option);
    }
  };

  const handlePlaceHolderKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (disabled) return;
      setIsOpen((currentIsOpen) => {
        const next = !currentIsOpen;
        if (next) broadcastOpen();
        return next;
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setSearchQuery(event.target.value);
    setIsOpen(true);
    broadcastOpen();
  };

  return (
    <div className={styles.container}>
      {title && <h5 className={styles.title}>{title}</h5>}
      <div
        className={styles.selectWrapper}
        ref={rootRef}
        data-is-active={isOpen}
        data-disabled={disabled}
        data-testid="selectWrapper"
      >
        <div
          className={styles.placeholder}
          onClick={handlePlaceHolderClick}
          onKeyPress={handlePlaceHolderKeyPress}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-expanded={isOpen}
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
              disabled={disabled}
            />
          )}
          <img src={arrowDown} alt="иконка стрелочки" className={styles.arrow} />
        </div>
        {isOpen && (
          <div className={styles.openSelect}>
            <ul className={`${styles.select} ${styles.selectShort}`} data-testid="selectDropdown">
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
                      tabIndex={disabled ? -1 : 0}
                      aria-disabled={disabled}
                    >
                      {type === 'сheckbox' && !selected.some((element) => element === option) && (
                        <CheckboxDefaultIcon className={styles.checkbox} aria-hidden="true" />
                      )}
                      {type === 'сheckbox' && selected.some((element) => element === option) && (
                        <CheckboxDoneIcon className={styles.checkbox} aria-hidden="true" />
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
