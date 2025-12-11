import { useState, useRef, useEffect } from 'react';
import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
import { validateDateInput } from '../utils';

const DATE_FORMAT = 'dd.MM.yyyy';

interface UseDateInputParams {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled: (date: Date) => boolean;
}

interface UseDateInputReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  setInputValue: (value: string) => void;
}

function useDateInput({
  value,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
}: UseDateInputParams): UseDateInputReturn {
  const [inputValue, setInputValue] = useState<string>(value ? format(value, DATE_FORMAT) : '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with external value
  useEffect(() => {
    if (value) {
      setInputValue(format(value, DATE_FORMAT));
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Validate the new input
    if (!validateDateInput(newValue)) {
      // Invalid input - ignore the change
      return;
    }

    // Update the input value
    setInputValue(newValue);

    // Try to parse the date if it matches the format
    if (newValue.length === 10) {
      const parsedDate = parse(newValue, DATE_FORMAT, new Date());
      if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
        onChange(parsedDate);
      }
    } else if (newValue === '') {
      onChange(undefined);
    }
  };

  const handleInputBlur = () => {
    // On blur, validate and format the input
    if (!inputValue) {
      onChange(undefined);
      return;
    }

    // Try to parse the date
    const parsedDate = parse(inputValue, DATE_FORMAT, new Date());

    if (isValid(parsedDate)) {
      // Check if date needs to be corrected due to min/max boundaries
      let correctedDate = parsedDate;

      if (minDate && isBefore(parsedDate, minDate)) {
        correctedDate = minDate;
      } else if (maxDate && isAfter(parsedDate, maxDate)) {
        correctedDate = maxDate;
      }

      // Format and update
      setInputValue(format(correctedDate, DATE_FORMAT));
      onChange(correctedDate);
    } else {
      // Invalid date, revert to previous value
      setInputValue(value ? format(value, DATE_FORMAT) : '');
    }
  };

  return {
    inputRef,
    inputValue,
    handleInputChange,
    handleInputBlur,
    setInputValue,
  };
}

export default useDateInput;
