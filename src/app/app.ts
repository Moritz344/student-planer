import { Component, signal,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './dialog/dialog-service';
import { Dialog } from './dialog/dialog'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Dialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('student-planer-app');
  public dialog = inject(DialogService);
}
