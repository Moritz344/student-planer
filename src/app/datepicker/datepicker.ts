import { Component, computed, effect, Input, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO: choose position based on enough space

const DAYS_PER_WEEK = 7;
const WEEKS_PER_CALENDAR_PAGE = 6;
const MINUTES_PER_HOUR = 60;

const EUROPEAN_DATE_PATTERN =
  /^(?<day>\d{1,2})[./](?<month>\d{1,2})[./](?<year>\d{4})(?:[ ,]+(?<hours>\d{1,2}):(?<minutes>\d{2}))?$/;

const ISO_DATE_PATTERN =
  /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:[T ]+(?<hours>\d{1,2}):(?<minutes>\d{2}))?$/;

const TIME_PATTERN = /^(?<hours>\d{1,2}):(?<minutes>\d{2})$/;

interface CalendarDay {
  date: Date;
  isInViewedMonth: boolean;
}

type CalendarWeek = CalendarDay[];

interface TypedDateAndTime {
  day: string;
  month: string;
  year: string;
  hours?: string;
  minutes?: string;
}

@Component({
  selector: 'app-datepicker',
  imports: [FormsModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker implements OnInit {
  @Input('time') public showTime: boolean = true;

  public readonly value = model<number | null>(null);

  public readonly isCalendarVisible = signal(false);
  public readonly viewedMonth = signal<Date>(startOfMonth(new Date()));
  public readonly dateText = signal('');
  public readonly timeText = signal('');

  public readonly weekdayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  public readonly monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  public readonly calendarWeeks = computed(() => buildCalendarWeeks(this.viewedMonth()));

  private isEditedByUser = false;

  constructor() {
    effect(() => this.syncInputsWithValue());
  }

  ngOnInit(): void {
    this.selectToday();
  }

  toggleCalendar(): void {
    if (this.isCalendarVisible()) {
      this.closeCalendar();
      return;
    }

    this.openCalendar();
  }

  openCalendar(): void {
    this.viewedMonth.set(startOfMonth(this.getSelectedDate() ?? new Date()));
    this.isCalendarVisible.set(true);
  }

  closeCalendar(): void {
    this.isCalendarVisible.set(false);
    this.refreshInputsAfterClosing();
  }

  goToPreviousMonth(): void {
    this.viewedMonth.set(shiftMonth(this.viewedMonth(), -1));
  }

  goToNextMonth(): void {
    this.viewedMonth.set(shiftMonth(this.viewedMonth(), 1));
  }

  selectDay(date: Date): void {
    const selectedDay = applyTimeOfDay(date, this.getTimeOfDayInMinutes());

    this.value.set(selectedDay.getTime());

    this.closeCalendar();
  }

  onDateTextChange(typedDate: string): void {
    this.isEditedByUser = true;
    this.dateText.set(typedDate);
    this.value.set(parseDateText(typedDate, this.timeText()));
  }

  onTimeChange(typedTime: string): void {
    this.isEditedByUser = true;
    this.timeText.set(typedTime);

    const selectedDate = this.getSelectedDate();

    if (!selectedDate) {
      return;
    }

    const minutesSinceMidnight = parseTimeText(typedTime);

    if (minutesSinceMidnight == null) {
      return;
    }

    const timestamp = applyTimeOfDay(selectedDate, minutesSinceMidnight).getTime();

    this.value.set(timestamp);
    this.dateText.set(formatTimestamp(timestamp));
  }

  isSelectedDay(date: Date): boolean {
    const selectedDate = this.getSelectedDate();

    if (!selectedDate) {
      return false;
    }

    return isSameDay(selectedDate, date);
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  isOutsideViewedMonth(date: Date): boolean {
    return !isInSameMonth(date, this.viewedMonth());
  }

  private selectToday(): void {
    this.onDateTextChange(formatDate(Date.now()));
    this.onTimeChange(formatTimeOfDay(Date.now()))
  }

  private syncInputsWithValue(): void {
    const timestamp = this.value();

    if (this.isEditedByUser) {
      this.isEditedByUser = false;
      return;
    }

    this.applyValueToInputs(timestamp);
  }

  private refreshInputsAfterClosing(): void {
    const timestamp = this.value();

    if (!isFilledTimestamp(timestamp)) {
      return;
    }

    this.isEditedByUser = true;

    this.applyValueToInputs(timestamp);
  }

  private applyValueToInputs(timestamp: number | null): void {
    if (!isFilledTimestamp(timestamp)) {
      this.dateText.set('');
      this.timeText.set('');
      return;
    }

    const formattedTime = hasTimeOfDay(timestamp) ? formatTimeOfDay(timestamp) : '';

    this.dateText.set(formatTimestamp(timestamp));
    this.timeText.set(formattedTime);
  }

  private getSelectedDate(): Date | null {
    const timestamp = this.value();

    if (!isFilledTimestamp(timestamp)) {
      return null;
    }

    return new Date(timestamp);
  }

  private getTimeOfDayInMinutes(): number {
    return parseTimeText(this.timeText()) ?? 0;
  }
}

function buildCalendarWeeks(viewedMonth: Date): CalendarWeek[] {
  const firstDayOfGrid = startOfFirstWeekOf(viewedMonth);
  const weeks: CalendarWeek[] = [];

  for (let weekIndex = 0; weekIndex < WEEKS_PER_CALENDAR_PAGE; weekIndex++) {
    const firstDayOfWeek = addDays(firstDayOfGrid, weekIndex * DAYS_PER_WEEK);

    weeks.push(buildCalendarWeek(firstDayOfWeek, viewedMonth));
  }

  return weeks;
}

function buildCalendarWeek(firstDayOfWeek: Date, viewedMonth: Date): CalendarWeek {
  const days: CalendarDay[] = [];

  for (let dayIndex = 0; dayIndex < DAYS_PER_WEEK; dayIndex++) {
    const date = addDays(firstDayOfWeek, dayIndex);

    days.push({ date, isInViewedMonth: isInSameMonth(date, viewedMonth) });
  }

  return days;
}

function startOfFirstWeekOf(month: Date): Date {
  const daysSinceMonday = (month.getDay() + 6) % DAYS_PER_WEEK;

  return addDays(startOfDay(month), -daysSinceMonday);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function shiftMonth(month: Date, monthOffset: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + monthOffset, 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(firstDate: Date, secondDate: Date): boolean {
  return startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime();
}

function isInSameMonth(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth()
  );
}

function isFilledTimestamp(timestamp: number | null): timestamp is number {
  return timestamp != null && timestamp !== 0;
}

function parseDateText(typedDate: string, fallbackTimeOfDay: string): number | null {
  const typedDateAndTime = matchDateText(typedDate);

  if (!typedDateAndTime) {
    return null;
  }

  const typedDateOnly = createDate(
    Number(typedDateAndTime.day),
    Number(typedDateAndTime.month),
    Number(typedDateAndTime.year),
  );

  if (!typedDateOnly) {
    return null;
  }

  const typedTimeOfDay = typedDateAndTime.hours
    ? `${typedDateAndTime.hours}:${typedDateAndTime.minutes}`
    : fallbackTimeOfDay;

  const minutesSinceMidnight = parseTimeText(typedTimeOfDay);

  if (minutesSinceMidnight == null) {
    return null;
  }

  return applyTimeOfDay(typedDateOnly, minutesSinceMidnight).getTime();
}

function matchDateText(typedDate: string): TypedDateAndTime | null {
  const trimmedText = typedDate.trim();
  const match = trimmedText.match(EUROPEAN_DATE_PATTERN) ?? trimmedText.match(ISO_DATE_PATTERN);
  const groups = match?.groups;

  if (!groups) {
    return null;
  }

  return {
    day: groups['day'],
    month: groups['month'],
    year: groups['year'],
    hours: groups['hours'],
    minutes: groups['minutes'],
  };
}

function createDate(day: number, month: number, year: number): Date | null {
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function parseTimeText(typedTime: string): number | null {
  const trimmedText = typedTime.trim();

  if (trimmedText === '') {
    return 0;
  }

  const match = trimmedText.match(TIME_PATTERN);

  if (!match?.groups) {
    return null;
  }

  return toMinutesSinceMidnight(Number(match.groups['hours']), Number(match.groups['minutes']));
}

function toMinutesSinceMidnight(hours: number, minutes: number): number | null {
  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * MINUTES_PER_HOUR + minutes;
}

function applyTimeOfDay(date: Date, minutesSinceMidnight: number): Date {
  const hours = Math.floor(minutesSinceMidnight / MINUTES_PER_HOUR);
  const minutes = minutesSinceMidnight % MINUTES_PER_HOUR;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

function formatTimestamp(timestamp: number): string {
  const formattedDate = formatDate(timestamp);

  if (!hasTimeOfDay(timestamp)) {
    return formattedDate;
  }

  return `${formattedDate} ${formatTimeOfDay(timestamp)}`;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = padToTwoDigits(date.getDate());
  const month = padToTwoDigits(date.getMonth() + 1);

  return `${day}.${month}.${date.getFullYear()}`;
}

function formatTimeOfDay(timestamp: number): string {
  const date = new Date(timestamp);

  return `${padToTwoDigits(date.getHours())}:${padToTwoDigits(date.getMinutes())}`;
}

function hasTimeOfDay(timestamp: number): boolean {
  const date = new Date(timestamp);

  return date.getHours() !== 0 || date.getMinutes() !== 0;
}

function padToTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}
