import { TimetableConfig } from '../types';

export interface ScheduleSlot {
  period: number,
  start: string,
  end: string
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = String(time).split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(total: number): string {
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function buildSchedule(config: TimetableConfig | undefined): ScheduleSlot[] {
  if (!config || !config.start_time || !config.end_time) { return []; }

  const hourLength = Number(config.hour_length) || 45;
  const breakStep = Number(config.break_step) || 0;
  const breakTime = Number(config.break_time) || 0;
  const end = timeToMinutes(config.end_time);
  let cursor = timeToMinutes(config.start_time);

  const schedule: ScheduleSlot[] = [];
  while (cursor + hourLength <= end) {
    const start = cursor;
    cursor += hourLength;
    schedule.push({
      period: schedule.length + 1,
      start: minutesToTime(start),
      end: minutesToTime(cursor)
    });
    if (breakStep > 0 && schedule.length % breakStep === 0) {
      cursor += breakTime;
    }
  }
  return schedule;
}
