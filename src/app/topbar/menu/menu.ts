import { Component, EventEmitter,Output,inject } from '@angular/core';
import { Electron } from '../../electron';
import { Settings } from '../../settings';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Output() close = new EventEmitter<void>();

  private electron = inject(Electron);
  private settings = inject(Settings);

  constructor() {}

  onClose() {
    this.close.emit();
  }

  onAbout() {
    this.electron.openAbout();
  }

  onExitProgram() {
    this.electron.exit();
  }

}
