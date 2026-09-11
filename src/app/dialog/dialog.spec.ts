import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Dialog } from './dialog';

@Component({
  selector: 'app-test-host',
  imports: [Dialog],
  template: `
    <app-dialog
      title="Delete Subject"
      primaryButtonLabel="Delete"
      secondaryButtonLabel="Cancel"
      (close)="onClose()"
      (primaryAction)="onPrimary()"
      (secondaryAction)="onSecondary()">
      <p class="content-projection">Are you sure?</p>
    </app-dialog>
  `,
})
class TestHost {
  closed = signal(false);
  primary = signal(false);
  secondary = signal(false);

  onClose() {
    this.closed.set(true);
  }

  onPrimary() {
    this.primary.set(true);
  }

  onSecondary() {
    this.secondary.set(true);
  }
}

describe('Dialog', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.title'));
    expect(title.nativeElement.textContent).toContain('Delete Subject');
  });

  it('should project custom content', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.content-projection'));
    expect(content.nativeElement.textContent).toContain('Are you sure?');
  });

  it('should render primary and secondary buttons', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('.actions button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Cancel');
    expect(buttons[1].nativeElement.textContent).toContain('Delete');
  });

  it('should emit close when close button clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    closeButton.nativeElement.click();
    vi.advanceTimersByTime(200);
    fixture.detectChanges();
    expect(fixture.componentInstance.closed()).toBe(true);
  });

  it('should emit secondaryAction when secondary button clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const secondary = fixture.debugElement.queryAll(By.css('.actions button'))[0];
    secondary.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.secondary()).toBe(true);
  });

  it('should emit primaryAction when primary button clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const primary = fixture.debugElement.queryAll(By.css('.actions button'))[1];
    primary.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.primary()).toBe(true);
  });

  it('should emit close when backdrop clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('.backdrop'));
    backdrop.nativeElement.click();
    vi.advanceTimersByTime(200);
    fixture.detectChanges();
    expect(fixture.componentInstance.closed()).toBe(true);
  });
});