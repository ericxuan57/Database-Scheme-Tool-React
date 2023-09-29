import { addHours, format } from 'date-fns';

export const adjustDate = (date: string | number | Date) => addHours(new Date(date), 12);

export const formatVersion = (version?: string | null) => {
  if (!version) return '';
  return format(adjustDate(version ?? Date.now()), 'yyyy-MM-dd');
};
