import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.locale('zh-cn');

export type DateInput = string | number | Date | dayjs.Dayjs;

export const date = (input?: DateInput): dayjs.Dayjs => dayjs(input);

export const formatDate = (
  input: DateInput,
  format: string = 'YYYY-MM-DD'
): string => {
  return dayjs(input).format(format);
};

export const formatDateTime = (
  input: DateInput,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(input).format(format);
};

export const formatTime = (
  input: DateInput,
  format: string = 'HH:mm:ss'
): string => {
  return dayjs(input).format(format);
};

export const formatRelative = (input: DateInput): string => {
  return dayjs(input).fromNow();
};

export const today = (): dayjs.Dayjs => dayjs().startOf('day');

export const now = (): dayjs.Dayjs => dayjs();

export const getLastNDays = (n: number, endDate?: DateInput): string[] => {
  const end = endDate ? dayjs(endDate) : dayjs();
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(end.subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return result;
};

export const getLastNWeeks = (n: number, endDate?: DateInput): string[] => {
  const end = endDate ? dayjs(endDate) : dayjs();
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const weekStart = end.subtract(i, 'week').startOf('week');
    result.push(weekStart.format('YYYY-MM-DD'));
  }
  return result;
};

export const getLastNMonths = (n: number, endDate?: DateInput): string[] => {
  const end = endDate ? dayjs(endDate) : dayjs();
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(end.subtract(i, 'month').format('YYYY-MM'));
  }
  return result;
};

export const getLastNYears = (n: number, endDate?: DateInput): string[] => {
  const end = endDate ? dayjs(endDate) : dayjs();
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(end.subtract(i, 'year').format('YYYY'));
  }
  return result;
};

export const getMonthDays = (year: number, month: number): string[] => {
  const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
  const daysInMonth = start.daysInMonth();
  const result: string[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    result.push(start.date(i).format('YYYY-MM-DD'));
  }
  return result;
};

export const getWeeksOfMonth = (year: number, month: number): Array<{ weekStart: string; weekEnd: string }> => {
  const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
  const end = start.endOf('month');
  const result: Array<{ weekStart: string; weekEnd: string }> = [];
  let current = start.startOf('week');
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    result.push({
      weekStart: current.format('YYYY-MM-DD'),
      weekEnd: current.endOf('week').format('YYYY-MM-DD'),
    });
    current = current.add(1, 'week');
  }
  return result;
};

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
}

export const calculateCountdown = (targetDate: DateInput): CountdownResult => {
  const target = dayjs(targetDate);
  const nowTime = dayjs();
  const diff = target.diff(nowTime);
  const dur = dayjs.duration(Math.max(diff, 0));

  return {
    days: Math.floor(dur.asDays()),
    hours: dur.hours(),
    minutes: dur.minutes(),
    seconds: dur.seconds(),
    totalMilliseconds: Math.max(diff, 0),
    isExpired: diff < 0,
  };
};

export const formatCountdown = (countdown: CountdownResult): string => {
  if (countdown.isExpired) return '已过期';
  const parts: string[] = [];
  if (countdown.days > 0) parts.push(`${countdown.days}天`);
  if (countdown.hours > 0) parts.push(`${countdown.hours}小时`);
  if (countdown.minutes > 0) parts.push(`${countdown.minutes}分`);
  if (countdown.seconds > 0 || parts.length === 0) parts.push(`${countdown.seconds}秒`);
  return parts.join('');
};

export const getStartOfDay = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).startOf('day');
};

export const getEndOfDay = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).endOf('day');
};

export const getStartOfWeek = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).startOf('week');
};

export const getEndOfWeek = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).endOf('week');
};

export const getStartOfMonth = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).startOf('month');
};

export const getEndOfMonth = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).endOf('month');
};

export const getStartOfQuarter = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).startOf('quarter');
};

export const getEndOfQuarter = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).endOf('quarter');
};

export const getStartOfYear = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).startOf('year');
};

export const getEndOfYear = (input?: DateInput): dayjs.Dayjs => {
  return (input ? dayjs(input) : dayjs()).endOf('year');
};

export const isSameDay = (date1: DateInput, date2: DateInput): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

export const isSameMonth = (date1: DateInput, date2: DateInput): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'month');
};

export const isSameYear = (date1: DateInput, date2: DateInput): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'year');
};

export const addDays = (input: DateInput, amount: number): dayjs.Dayjs => {
  return dayjs(input).add(amount, 'day');
};

export const addMonths = (input: DateInput, amount: number): dayjs.Dayjs => {
  return dayjs(input).add(amount, 'month');
};

export const addYears = (input: DateInput, amount: number): dayjs.Dayjs => {
  return dayjs(input).add(amount, 'year');
};

export const diffDays = (date1: DateInput, date2: DateInput): number => {
  return dayjs(date1).diff(dayjs(date2), 'day');
};

export const diffMonths = (date1: DateInput, date2: DateInput): number => {
  return dayjs(date1).diff(dayjs(date2), 'month');
};

export const diffYears = (date1: DateInput, date2: DateInput): number => {
  return dayjs(date1).diff(dayjs(date2), 'year');
};

export const getWeekRange = (weekStart: DateInput): { start: string; end: string } => {
  const start = dayjs(weekStart).startOf('week');
  return {
    start: start.format('YYYY-MM-DD'),
    end: start.endOf('week').format('YYYY-MM-DD'),
  };
};

export const randomDate = (start: DateInput, end: DateInput): string => {
  const startTime = dayjs(start).valueOf();
  const endTime = dayjs(end).valueOf();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return dayjs(randomTime).format('YYYY-MM-DD');
};

export const randomDateTime = (start: DateInput, end: DateInput): string => {
  const startTime = dayjs(start).valueOf();
  const endTime = dayjs(end).valueOf();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return dayjs(randomTime).format('YYYY-MM-DD HH:mm:ss');
};

export default dayjs;
