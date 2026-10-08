import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableSetup } from './timetable-setup';

describe('TimetableSetup', () => {
  let component: TimetableSetup;
  let fixture: ComponentFixture<TimetableSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
