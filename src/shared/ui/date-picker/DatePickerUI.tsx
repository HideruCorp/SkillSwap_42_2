import type { DatePickerProps } from './type'
import CalendarIcon from '@shared/assets/img/calendar.svg?react'
import Button from '@shared/ui/button/Button'
import { isAfter, isBefore } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { Dropdown } from '../dropdown'
import { CustomDropdown, CustomYearsDropdown } from './CustomDropdown'
import styles from './date-picker.module.scss'
import { useCalendarState, useDateInput } from './hooks'

// Generate years range (50 years back from current)
const currentYear = new Date().getFullYear()
const START_YEAR = currentYear - 50
const END_YEAR = currentYear

export function DatePickerUI({
  name,
  value,
  onChange,
  placeholder = 'дд.мм.гггг',
  disabled = false,
  error,
  minDate,
  maxDate,
}: DatePickerProps) {
  // Memoize date validation
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && isBefore(date, minDate))
        return true
      if (maxDate && isAfter(date, maxDate))
        return true
      return false
    },
    [minDate, maxDate],
  )

  // Use extracted hooks
  const { inputRef, inputValue, handleInputChange, handleInputBlur, setInputValue } = useDateInput({
    value,
    onChange,
    minDate,
    maxDate,
    isDateDisabled,
  })

  const {
    isOpen,
    month,
    setMonth,
    draftDate,
    handleCancel,
    handleConfirm,
    handleDaySelect,
    toggleCalendar,
    handleToggle,
  } = useCalendarState({
    value,
    onChange,
    isDateDisabled,
    setInputValue,
    disabled,
  })

  // Memoize input wrapper classes
  const inputWrapperClass = useMemo(
    () =>
      [
        styles['input-wrapper'],
        isOpen && styles['input-wrapper--open'],
        error && styles['input-wrapper--error'],
        disabled && styles['input-wrapper--disabled'],
      ]
        .filter(Boolean)
        .join(' '),
    [isOpen, error, disabled],
  )

  // Memoize disabled matcher for DayPicker
  const disabledMatcher = useMemo(() => {
    const matcher = []
    if (minDate)
      matcher.push({ before: minDate })
    if (maxDate)
      matcher.push({ after: maxDate })
    return matcher
  }, [minDate, maxDate])

  // Memoize month boundaries
  const { startMonth, endMonth } = useMemo(
    () => ({
      startMonth: minDate
        ? new Date(minDate.getFullYear(), minDate.getMonth(), 1)
        : new Date(START_YEAR, 0, 1),
      endMonth: maxDate
        ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
        : new Date(END_YEAR, 11, 1),
    }),
    [minDate, maxDate],
  )

  return (
    <Dropdown
      className={styles.container}
      trigger={(
        <>
          <div className={inputWrapperClass}>
            <input
              ref={inputRef}
              name={name}
              type="text"
              className={styles.input}
              value={inputValue}
              placeholder={placeholder}
              disabled={disabled}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            <CalendarIcon className={styles['calendar-icon']} onClick={toggleCalendar} />
          </div>
          {error && <span className={styles['error-text']}>{error}</span>}
        </>
      )}
      isOpen={isOpen}
      align="left"
      onToggle={handleToggle}
    >
      <div className={styles.dropdown} role="dialog" aria-modal="true">
        <div className={styles.calendar}>
          <DayPicker
            locale={ru}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            selected={draftDate}
            onSelect={handleDaySelect}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledMatcher}
            weekStartsOn={1}
            components={{ MonthsDropdown: CustomDropdown, YearsDropdown: CustomYearsDropdown }}
            classNames={{
              root: styles['rdp-root'],
              month_caption: styles.caption,
              dropdowns: styles.dropdowns,
              nav: styles.nav,
              weekdays: styles.weekdays,
              weekday: styles.weekday,
              month_grid: styles['month-grid'],
              week: styles.week,
              day: styles.day,
              day_button: styles['day-button'],
              selected: styles.selected,
              today: styles.today,
              disabled: styles.disabled,
              outside: styles.outside,
            }}
          />
        </div>
        <div className={styles.footer}>
          <Button
            title="Отменить"
            variant="secondary"
            onClick={handleCancel}
            className={styles.button}
          />
          <Button
            title="Выбрать"
            variant="primary"
            onClick={handleConfirm}
            className={styles.button}
            disabled={!draftDate}
          />
        </div>
      </div>
    </Dropdown>
  )
}

export default DatePickerUI
