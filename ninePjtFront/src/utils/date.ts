type DateFormat = 'date' | 'datetime' | 'time';

const pad = (value: number): string => value.toString().padStart(2, '0');

export const formatDateString = (value: string | number | Date, format: DateFormat = 'date'): string => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  switch (format) {
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'date':
    default:
      return `${year}-${month}-${day}`;
  }
};


