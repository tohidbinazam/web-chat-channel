const calculateEndDate = (subscriptionType, selectedDate) => {
  const currentDate = new Date();

  if (subscriptionType === '6 months') {
    const sixMonthsLater = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 6,
      currentDate.getDate()
    );
    return sixMonthsLater.toISOString();
  } else if (subscriptionType === '1 year') {
    const oneYearLater = new Date(
      currentDate.getFullYear() + 1,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    return oneYearLater.toISOString();
  } else if (subscriptionType === 'temporary') {
    if (!selectedDate) {
      throw new Error('Selected date is required for temporary subscription.');
    }
    const endDate = new Date(selectedDate);
    return endDate.toISOString();
  } else {
    throw new Error(
      'Invalid subscription type. Must be "6_months", "1_year", or "temporary".'
    );
  }
};

export const ISOtoLocalString = (isoStringDate) => {
  const date = new Date(isoStringDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string.');
  }
  return date.toLocaleString();
};

export const isoToDatePicker = (isoDate) => {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default calculateEndDate;
