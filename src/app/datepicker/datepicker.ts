import { Component, computed, effect, model, signal,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  imports: [FormsModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker implements OnInit {
  public value = model<number | null>(null);

  public show = signal(false);
  public text = signal<string | null>('');
  public viewMonth = signal<Date>(Datepicker.startOfMonth(new Date()));

  public weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  public months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  private dirty = false;

  constructor() {
    effect(() => {
      if (this.dirty) {
        this.dirty = false;
        return;
      }
      this.text.set(this.value() == null || this.value() === 0 ? '' : this.format(this.value()!));
    });
  }

  ngOnInit(): void {
    this.initDateToday();
  }

  initDateToday() {
    this.onTextChange(new Date().toLocaleDateString());
  }

  public weeks = computed(() => {
    const month = this.viewMonth();
    const startOffset = (month.getDay() + 6) % 7;
    const cursor = new Date(month);
    cursor.setDate(cursor.getDate() - startOffset);
    const grid: { date: Date; current: boolean }[][] = [];
    for (let week = 0; week < 6; week++) {
      const row: { date: Date; current: boolean }[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(cursor);
        row.push({ date, current: date.getMonth() === month.getMonth() });
        cursor.setDate(cursor.getDate() + 1);
      }
      grid.push(row);
    }
    return grid;
  });

  toggle() {
    if (this.show()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const selected = this.value();
    const base = selected != null && selected !== 0 ? new Date(selected) : new Date();
    this.viewMonth.set(Datepicker.startOfMonth(base));
    this.show.set(true);
  }

  close() {
    this.show.set(false);
    this.syncText();
  }

  prevMonth() {
    const current = this.viewMonth();
    this.viewMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.viewMonth();
    this.viewMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  select(date: Date) {
    this.value.set(this.startOfDay(date).getTime());
    this.close();
  }

  onTextChange(text: string) {
    this.dirty = true;
    this.text.set(text);
    this.value.set(this.parse(text));
  }

  syncText() {
    this.dirty = true;
    const value = this.value();
    this.text.set(value == null || value === 0 ? this.text() : this.format(value));
  }

  isSelected(date: Date) {
    return this.value() === this.startOfDay(date).getTime();
  }

  isToday(date: Date) {
    return this.startOfDay(date).getTime() === this.startOfDay(new Date()).getTime();
  }

  isDimmed(date: Date) {
    return date.getMonth() !== this.viewMonth().getMonth();
  }

  private parse(text: string): number | null {
    const trimmed = text.trim();
    const european = trimmed.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
    const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!european && !iso) return null;
    const parts: [number, number, number] = european
      ? [+european[1], +european[2], +european[3]]
      : [+iso![2], +iso![3], +iso![1]];
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date.getTime();
  }

  private format(timestamp: number): string {
    const date = new Date(timestamp);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}
