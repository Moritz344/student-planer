import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datepicker } from './datepicker';

describe('Datepicker', () => {
  let component: Datepicker;
  let fixture: ComponentFixture<Datepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datepicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format a timestamp as DD.MM.YYYY', () => {
    const value = new Date(2026, 8, 23).getTime();
    component.value.set(value);
    fixture.detectChanges();
    expect(component.dateText()).toBe('23.09.2026');
  });

  it('should parse a typed DD.MM.YYYY date', () => {
    component.onDateTextChange('23.09.2026');
    const expected = new Date(2026, 8, 23).getTime();
    expect(component.value()).toBe(expected);
  });

  it('should treat invalid input as no value', () => {
    component.onDateTextChange('31.02.2026');
    expect(component.value()).toBeNull();
  });

  it('should select a date from the calendar', () => {
    const day = new Date(2026, 8, 23);

    component.selectDay(day);

    expect(component.value()).toBe(day.getTime());
    expect(component.isCalendarVisible()).toBeFalsy();
    expect(component.dateText()).toBe('23.09.2026');
  });

  it('should keep the entered time in the value', () => {
    component.onDateTextChange('23.09.2026');

    component.onTimeChange('14:30');

    expect(component.value()).toBe(new Date(2026, 8, 23, 14, 30).getTime());
    fixture.detectChanges();
    expect(component.timeText()).toBe('14:30');
    expect(component.dateText()).toBe('23.09.2026 14:30');
  });

  it('should parse a typed date with a time', () => {
    component.onDateTextChange('23.09.2026 08:15');
    expect(component.value()).toBe(new Date(2026, 8, 23, 8, 15).getTime());
  });

  it('should keep the time when a calendar day is selected', () => {
    component.onDateTextChange('23.09.2026');
    component.onTimeChange('14:30');

    component.selectDay(new Date(2026, 8, 24));

    expect(component.value()).toBe(new Date(2026, 8, 24, 14, 30).getTime());
    expect(component.dateText()).toBe('24.09.2026 14:30');
  });

  it('should keep the date when only a time is entered', () => {
    component.onDateTextChange('23.09.2026');

    component.onTimeChange('14:30');

    expect(component.value()).toBe(new Date(2026, 8, 23, 14, 30).getTime());
  });

  it('should mark a day as selected even when a time is set', () => {
    component.onDateTextChange('23.09.2026');
    component.onTimeChange('14:30');

    expect(component.isSelectedDay(new Date(2026, 8, 23))).toBe(true);
    expect(component.isSelectedDay(new Date(2026, 8, 24))).toBe(false);
  });

  it('should ignore an invalid time', () => {
    component.onDateTextChange('23.09.2026');

    component.onTimeChange('25:70');

    expect(component.value()).toBe(new Date(2026, 8, 23).getTime());
  });

  it('should navigate to the next and previous month', () => {
    const monthBeforeNavigation = component.viewedMonth().getMonth();

    component.goToNextMonth();
    expect(component.viewedMonth().getMonth()).toBe((monthBeforeNavigation + 1) % 12);

    component.goToPreviousMonth();
    expect(component.viewedMonth().getMonth()).toBe(monthBeforeNavigation);
  });

  it('should always show six weeks of days', () => {
    expect(component.calendarWeeks().length).toBe(6);
    expect(component.calendarWeeks()[0].length).toBe(7);
  });
});