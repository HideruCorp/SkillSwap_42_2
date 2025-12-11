import { useState, useCallback } from 'react';
import { format } from 'date-fns';

const DATE_FORMAT = 'dd.MM.yyyy';

interface UseCalendarStateParams {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  isDateDisabled: (date: Date) => boolean;
  setInputValue: (value: string) => void;
  disabled?: boolean;
}

interface UseCalendarStateReturn {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  month: Date;
  setMonth: (month: Date) => void;
  draftDate: Date | undefined;
  handleCancel: () => void;
  handleConfirm: () => void;
  handleDaySelect: (date: Date | undefined) => void;
  toggleCalendar: (e: React.MouseEvent) => void;
  handleToggle: (newIsOpen: boolean) => void;
}

function useCalendarState({
  value,
  onChange,
  isDateDisabled,
  setInputValue,
  disabled = false,
}: UseCalendarStateParams): UseCalendarStateReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value || new Date());
  const [draftDate, setDraftDate] = useState<Date | undefined>(value || undefined);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setDraftDate(value || undefined);
    setMonth(value || new Date());
  }, [value]);

  const handleConfirm = useCallback(() => {
    onChange(draftDate || undefined);
    if (draftDate) {
      setInputValue(format(draftDate, DATE_FORMAT));
    }
    setIsOpen(false);
  }, [draftDate, onChange, setInputValue]);

  const handleDaySelect = useCallback(
    (date: Date | undefined) => {
      if (date && !isDateDisabled(date)) {
        setDraftDate(date);
        setMonth(date);
      }
    },
    [isDateDisabled]
  );

  const toggleCalendar = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;

      if (isOpen) {
        handleCancel();
      } else {
        setIsOpen(true);
        setDraftDate(value || undefined);
        setMonth(value || new Date());
      }
    },
    [disabled, isOpen, handleCancel, value]
  );

  const handleToggle = useCallback(
    (newIsOpen: boolean) => {
      if (!newIsOpen) {
        handleCancel();
      }
      setIsOpen(newIsOpen);
    },
    [handleCancel]
  );

  return {
    isOpen,
    setIsOpen,
    month,
    setMonth,
    draftDate,
    handleCancel,
    handleConfirm,
    handleDaySelect,
    toggleCalendar,
    handleToggle,
  };
}

export default useCalendarState;
