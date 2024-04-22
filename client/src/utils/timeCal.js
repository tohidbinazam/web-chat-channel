const timeCal = (IOSDateString) => {
  const date = new Date(IOSDateString);
  const now = new Date();

  // Function to format time in 12-hour format with AM/PM
  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // If the date is today, show only time
    return formatTime(date);
  } else if (diffDays <= 6) {
    // If the date is within the last 6 days (excluding today)
    if (date.getDay() === 0) {
      // If it's Sunday, show SUN and time
      return `SUN ${formatTime(date)}`;
    } else if (date.getDay() === 6) {
      // If it's Saturday, show SAT and time
      return `SAT ${formatTime(date)}`;
    } else {
      // For other weekdays, show the day of the week (e.g., MON) and time
      const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayOfWeek = weekdays[date.getDay()];
      return `${dayOfWeek} ${formatTime(date)}`;
    }
  } else if (diffDays < 30) {
    // If the date is within the last month, show month, day, and time
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${formatTime(date)}`;
  } else if (diffDays < 365) {
    // If the date is within the last year, show month, day, and time
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${formatTime(date)}`;
  } else {
    // For dates older than a year, show day, month, year, and time
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    return `${day}/${month}/${year}, ${formatTime(date)}`;
  }
};

export default timeCal;
