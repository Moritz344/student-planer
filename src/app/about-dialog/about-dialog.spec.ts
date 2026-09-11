import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { AboutDialog } from './about-dialog';
import { Electron } from '../electron';

@Component({
  selector: 'app-test-host',
  imports: [AboutDialog],
  template: `<app-about-dialog (close)="closed.set(true)"></app-about-dialog>`,
})
class TestHost {
  closed = signal(false);
}

describe('AboutDialog', () => {
  let electronSpy: { getAboutData: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.useFakeTimers();
    electronSpy = { getAboutData: vi.fn() };
    electronSpy.getAboutData.mockResolvedValue({
      name: 'student-planer-app',
      version: '0.0.0',
      description: 'student planer',
      author: 'Moritz',
    });

    await TestBed.configureTestingModule({
      imports: [TestHost, AboutDialog],
      providers: [
        {
          provide: Electron,
          useValue: electronSpy,
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(AboutDialog);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load about data and render app name, version and description', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.app-name'))?.nativeElement.textContent).toBe(
      'student-planer-app'
    );
    expect(fixture.debugElement.query(By.css('.version'))?.nativeElement.textContent).toBe(
      'Version 0.0.0'
    );
    expect(fixture.debugElement.query(By.css('.description'))?.nativeElement.textContent).toBe(
      'student planer'
    );
    expect(fixture.debugElement.query(By.css('.title'))?.nativeElement.textContent).toContain(
      'About student-planer-app'
    );
  });

  it('should emit close on primary action', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const primary = fixture.debugElement.query(By.css('.actions .primary'));
    primary.nativeElement.click();
    vi.advanceTimersByTime(200);
    fixture.detectChanges();
    expect(fixture.componentInstance.closed()).toBe(true);
  });
});