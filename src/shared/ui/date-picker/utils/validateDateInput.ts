/**
 * Validates date input character by character.
 * Format: dd.mm.yyyy (10 characters total)
 *
 * Rules:
 * - Positions 2 and 5 must be dots (.)
 * - All other positions must be digits (0-9)
 * - Day: 01-31
 * - Month: 01-12
 * - Year: 1000-2999
 *
 * @param newValue - The input string to validate
 * @returns true if the input is valid, false otherwise
 */
function validateDateInput(newValue: string): boolean {
  // Max length is 10 (dd.mm.yyyy)
  if (newValue.length > 10)
    return false

  // Empty string is valid
  if (newValue.length === 0)
    return true

  // Check each character
  for (let i = 0; i < newValue.length; i += 1) {
    const char = newValue[i]

    // Position 2 and 5 must be dots
    if (i === 2 || i === 5) {
      if (char !== '.')
        return false

      continue
    }

    // All other positions must be digits
    if (!/\d/.test(char))
      return false

    // Validate day (positions 0-1)
    if (i === 0) {
      // First digit of day: 0-3
      if (char < '0' || char > '3')
        return false
    } else if (i === 1) {
      const firstDayDigit = newValue[0]
      // Second digit of day depends on first digit
      if (firstDayDigit === '0') {
        // 01-09
        if (char < '1' || char > '9')
          return false
      } else if (firstDayDigit === '3') {
        // 30-31
        if (char < '0' || char > '1')
          return false
      }
      // For '1' and '2': 10-29 are all valid (0-9)
    }

    // Validate month (positions 3-4)
    if (i === 3) {
      // First digit of month: 0-1
      if (char < '0' || char > '1')
        return false
    } else if (i === 4) {
      const firstMonthDigit = newValue[3]
      // Second digit of month depends on first digit
      if (firstMonthDigit === '0') {
        // 01-09
        if (char < '1' || char > '9')
          return false
      } else if (firstMonthDigit === '1') {
        // 10-12
        if (char < '0' || char > '2')
          return false
      }
    }

    // Validate year (positions 6-9)
    if (i === 6) {
      // First digit of year: 1-2
      if (char < '1' || char > '2')
        return false
    }
    // Positions 7-9: any digit 0-9 (already validated above)
  }

  return true
}

export default validateDateInput
