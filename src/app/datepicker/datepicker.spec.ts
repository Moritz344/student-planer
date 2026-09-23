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
    expect(component.text()).toBe('23.09.2026');
  });

  it('should parse a typed DD.MM.YYYY date', () => {
    component.onTextChange('23.09.2026');
    const expected = new Date(2026, 8, 23).getTime();
    expect(component.value()).toBe(expected);
  });

  it('should treat invalid input as no value', () => {
    component.onTextChange('31.02.2026');
    expect(component.value()).toBeNull();
  });

  it('should select a date from the calendar', () => {
    const day = new Date(2026, 8, 23);
    component.select(day);
    expect(component.value()).toBe(day.getTime());
    expect(component.show()).toBeFalsy();
    expect(component.text()).toBe('23.09.2026');
  });
});